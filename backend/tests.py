from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from smileapp.models import Dentists, Patients, Consults, Messages, Tasks


class PermissionsTestCase(TestCase):

    def setUp(self):
        # Create two users: one dentist, one patient
        self.dentist_user = User.objects.create_user(username='dentist1', password='pass123')
        self.patient_user = User.objects.create_user(username='patient1', password='pass123')

        # Create a dentist profile linked to dentist_user
        self.dentist = Dentists.objects.create(
            first_name='Doc',
            last_name='Smith',
            email='doc@example.com',
            administrator=True,
            user=self.dentist_user,
            disabled=False
        )

        # Create a patient profile linked to patient_user, assigned to dentist
        self.patient = Patients.objects.create(
            first_name='John',
            last_name='Doe',
            email='john@example.com',
            phone_number='123456789',
            dentist=self.dentist,
            user=self.patient_user
        )

        # Create another patient/dentist pair to ensure isolation of data
        self.other_dentist_user = User.objects.create_user(username='dentist2', password='pass123')
        self.other_patient_user = User.objects.create_user(username='patient2', password='pass123')
        self.other_dentist = Dentists.objects.create(
            first_name='Another',
            last_name='Dentist',
            email='doc2@example.com',
            administrator=False,
            user=self.other_dentist_user,
            disabled=False
        )
        self.other_patient = Patients.objects.create(
            first_name='Jane',
            last_name='Doe',
            email='jane@example.com',
            phone_number='987654321',
            dentist=self.other_dentist,
            user=self.other_patient_user,
        )

        # Create a consult for the patient
        self.consult = Consults.objects.create(
            patient=self.patient,
            category='Checkup',
            stage='Initial',
            description='General checkup',
            amount=100,
            dentist=self.dentist
        )

        # Create a message between dentist and patient
        self.message = Messages.objects.create(
            patient=self.patient,
            dentist=self.dentist,
            text='Hello, how can I help you?',
        )

        # Create a task for this patient by the dentist
        self.task = Tasks.objects.create(
            patient=self.patient,
            dentist=self.dentist,
            type='Follow-up call',
            text='Call patient to discuss treatment plan',
            due_date='2099-12-31T00:00:00Z'
        )

        self.client = APIClient()

        # Obtain JWT tokens for each user
        self.dentist_token = self.get_jwt_token('dentist1', 'pass123')
        self.patient_token = self.get_jwt_token('patient1', 'pass123')
        self.other_dentist_token = self.get_jwt_token('dentist2', 'pass123')
        self.other_patient_token = self.get_jwt_token('patient2', 'pass123')

    def get_jwt_token(self, username, password):
        """Helper method to obtain a JWT token for a given user."""
        response = self.client.post('/api/token/', {'username': username, 'password': password})
        return response.json().get('access')

    def test_patient_can_see_own_messages(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        resp = self.client.get('/api/messages/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        self.assertEqual(len(data), 1, "Patient should see exactly one message")
        self.assertEqual(data[0]['id'], self.message.id)

    def test_other_dentist_cannot_access_another_dentists_data(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.other_dentist_token}')
        resp = self.client.get('/api/patients/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        ids = [p['id'] for p in data]
        self.assertNotIn(self.patient.id, ids, "Other dentist should not see the first dentist's patient")

    def test_dentist_can_see_own_patients_and_consults(self):
        # Login as dentist
        self.client.login(username='dentist1', password='pass123')

        # Dentist should see their own patients
        resp = self.client.get('/api/patients/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        self.assertEqual(len(data), 1, "Dentist should see exactly their one patient")
        self.assertEqual(data[0]['id'], self.patient.id)

        # Dentist sees consults related to their patients
        resp = self.client.get('/api/consults/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        self.assertEqual(len(data), 1, "Dentist should see the consult for their patient")
        self.assertEqual(data[0]['id'], self.consult.id)

        # Dentist sees tasks related to their patients
        resp = self.client.get('/api/tasks/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        self.assertEqual(len(data), 1, "Dentist should see the task for their patient")
        self.assertEqual(data[0]['id'], self.task.id)

        # Dentist should not see other dentist's patients
        # Confirm that the other patient's record does not appear
        for patient_record in data:
            self.assertNotEqual(patient_record['id'], self.other_patient.id,
                                "Dentist should not see another dentist's patient")

    def test_other_dentist_cannot_access_another_dentists_data(self):
        # Login as the other dentist
        self.client.login(username='dentist2', password='pass123')

        # Check patients for other dentist
        resp = self.client.get('/api/patients/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        # Should not see the first dentist's patient
        ids = [p['id'] for p in data]
        self.assertNotIn(self.patient.id, ids, "Other dentist should not see the first dentist's patient")

        # Check consults for other dentist
        resp = self.client.get('/api/consults/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        consult_ids = [c['id'] for c in data]
        self.assertNotIn(self.consult.id, consult_ids, "Other dentist should not see the first dentist's consults")

        # Check tasks
        resp = self.client.get('/api/tasks/')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()['data']
        task_ids = [t['id'] for t in data]
        self.assertNotIn(self.task.id, task_ids, "Other dentist should not see the first dentist's tasks")

    def test_unauthenticated_access(self):
        # Without login, access should fail
        resp = self.client.get('/api/patients/')
        self.assertEqual(resp.status_code, 403, "Unauthenticated requests should fail")
