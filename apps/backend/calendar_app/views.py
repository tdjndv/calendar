from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer

    def get_queryset(self):
        queryset = Note.objects.all()
        date = self.request.query_params.get("date")
        month = self.request.query_params.get("month")


        if date:
            queryset = queryset.filter(date=date)
        elif month:
            queryset = queryset.filter(date__startswith=month)
    
        return queryset