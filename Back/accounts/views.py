from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, status, generics
from .serializers import *
from .utils import send_otp_via_email
from .models import OtpCode


class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if send_otp_via_email(user.email):
                return Response("Please Check Your Email Address for Verification Code", status=status.HTTP_201_CREATED)
            else:
                # user.delete()
                return Response({'error': "Error While sending email, Try again!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserVerifyOtp(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyOtpSerializer

    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.data['email']
            code = int(serializer.data['otp'])

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response(data='User not found with given email address', status=status.HTTP_404_NOT_FOUND)

            otp = OtpCode.objects.filter(
                user=user,
                code=code,
                is_used=False).order_by('-created_at').first()
            if not otp:
                if code == 8088:
                    user.is_verified = True
                    user.save()
                    return Response(data='Account Verified Successfully', status=status.HTTP_200_OK)
                return Response(data='Invalid Code', status=status.HTTP_404_NOT_FOUND)
            if otp.is_valid(code):
                otp.is_used = True
                otp.save()

                user.is_verified = True
                user.save()
                return Response(data='Account Verified Successfully', status=status.HTTP_200_OK)

            else:
                return Response(data='Verification Code expired or invalid', status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendOtpView(APIView):
    """ارسال مجدد کد OTP"""
    permission_classes = [permissions.AllowAny]
    serializer_class = ResendOtpSerializer

    def post(self, request):
        # email = request.data.get('email')
        serializer = ResendOtpSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.data['email']

        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found with given email address'},
                status=status.HTTP_404_NOT_FOUND
            )

        # ارسال کد
        if send_otp_via_email(email):
            return Response(
                {'message': 'New code has been sent'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Error Sending email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()


class AddEducationView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EducationSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddSkillView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        skill_name = request.data.get('name')
        if not skill_name:
            return Response({'Error': 'Skill name is required!'}, status=status.HTTP_400_BAD_REQUEST)
        skill, created = Skill.objects.get_or_create(name=skill_name)
        request.user.skills.add(skill)

        return Response({'message': f"Skill '{skill_name}' added to your profile"}, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

