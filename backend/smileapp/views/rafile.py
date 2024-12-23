from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from smileapp.models import RAFile
from smileapp.serializers import RAFileSerializer

class RAFileView(APIView):
    def post(self, request):
        """Handle file upload."""
        serializer = RAFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(type=request.FILES['file'].content_type)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        """Retrieve a specific file or list all files."""
        if pk:
            try:
                file = RAFile.objects.get(pk=pk)
                serializer = RAFileSerializer(file)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except RAFile.DoesNotExist:
                return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            files = RAFile.objects.all()
            serializer = RAFileSerializer(files, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """Delete a file."""
        try:
            file = RAFile.objects.get(pk=pk)
            file.delete()
            return Response({'message': 'File deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except RAFile.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)