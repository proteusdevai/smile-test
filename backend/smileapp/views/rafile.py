import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from smileapp.models import RAFile
from smileapp.serializers import RAFileSerializer

logger = logging.getLogger(__name__)


class RAFileView(APIView):
    def post(self, request, *args, **kwargs):
        # Pass request data to the serializer
        serializer = RAFileSerializer(data=request.data)

        if serializer.is_valid():
            # Access validated data and save
            validated_data = serializer.validated_data
            file_instance = serializer.save(type=request.FILES['file'].content_type)

            return Response(
                {
                    "message": "File uploaded successfully",
                    "path": file_instance.path,  # Return the unique file path
                    "id": file_instance.id,     # Optionally return the ID
                    "url": file_instance.src,   # Return the file's URL
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            # Return validation errors
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
