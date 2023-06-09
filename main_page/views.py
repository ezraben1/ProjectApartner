from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework import viewsets
from core.authentication import ExpiredTokenAuthentication
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf
from rest_framework import status


def index(request):
    return JsonResponse(
        {
            "core": "http://127.0.0.1:8000/core/",
            "owner": "http://127.0.0.1:8000/owner/",
        }
    )


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class LoginViewSet(viewsets.ViewSet):
    authentication_classes = [ExpiredTokenAuthentication]

    def create(self, request):
        data = request.data
        response = Response()
        username = data.get("username", None)
        password = data.get("password", None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                    value=data["access"],
                    expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite="None",
                )
                csrf.get_token(request)
                response.data = {"Success": "Login successfully", "data": data}
                return response
            else:
                return Response(
                    {"No active": "This account is not active!!"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"Invalid": "Invalid username or password!!"},
                status=status.HTTP_404_NOT_FOUND,
            )


def react_view(request):
    return render(request, "react.html")
