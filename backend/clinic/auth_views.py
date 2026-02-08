"""
Authentication views for login, logout and user management.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .models import ClinicUser, Clinic


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login endpoint for web and mobile apps.
    
    Expected JSON:
    {
        "username": "user@example.com",
        "password": "password123"
    }
    
    Returns:
    {
        "token": "...",
        "user": {
            "id": 1,
            "username": "...",
            "full_name": "...",
            "role": "assistant",
            "clinic": {...}
        }
    }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Kullanıcı adı ve şifre gereklidir.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'error': 'Geçersiz kullanıcı adı veya şifre.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'Bu hesap devre dışı bırakılmış.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get or create token
    token, _ = Token.objects.get_or_create(user=user)
    
    # Build response
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.get_full_name(),
        'role': user.role,
        'role_display': user.get_role_display(),
    }
    
    if user.clinic:
        user_data['clinic'] = {
            'id': user.clinic.id,
            'name': user.clinic.name,
            'address': user.clinic.address,
            'phone': user.clinic.phone,
        }
    
    return Response({
        'token': token.key,
        'user': user_data
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout endpoint - deletes the auth token.
    """
    try:
        request.user.auth_token.delete()
    except:
        pass
    
    return Response({'message': 'Çıkış yapıldı.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Returns the current authenticated user's information.
    """
    user = request.user
    
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.get_full_name(),
        'role': user.role,
        'role_display': user.get_role_display(),
        'phone': user.phone,
    }
    
    if user.clinic:
        user_data['clinic'] = {
            'id': user.clinic.id,
            'name': user.clinic.name,
            'address': user.clinic.address,
            'phone': user.clinic.phone,
        }
    
    return Response(user_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def clinics_list(request):
    """
    Returns list of clinics for selection on login screen.
    Only returns basic info for public display.
    """
    clinics = Clinic.objects.all().values('id', 'name', 'address')
    return Response(list(clinics))
