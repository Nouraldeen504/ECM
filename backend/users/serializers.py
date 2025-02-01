# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from dj_rest_auth.serializers import LoginSerializer as DefaultLoginSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'phone', 'role', 'status', 'password')
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure the password is never returned in the response
        }

    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data.get('password'))
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle password update
        password = validated_data.pop('password', None)
        if password:
            instance.password = make_password(password)

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class TokenSerializer(serializers.Serializer):
    key = serializers.CharField()
    user = UserSerializer()  # This will include user data in the response

class LoginSerializer(DefaultLoginSerializer):
    username = None
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        data['phone'] = self.validated_data.get('phone', '')
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.validated_data.get('first_name')
        user.last_name = self.validated_data.get('last_name')
        user.phone = self.validated_data.get('phone')
        user.save()
        return user