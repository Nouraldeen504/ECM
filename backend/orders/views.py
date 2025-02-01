# orders/views.py
import stripe
from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Order, OrderItem, Payment
from .serializers import OrderSerializer, OrderItemSerializer, PaymentSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
def process_payment(request):
    try:
        payment_method_id = request.data.get('payment_method_id')
        amount = request.data.get('amount')

        # Create payment intent
        intent = stripe.PaymentIntent.create(
            payment_method=payment_method_id,
            amount=amount,
            currency='usd',
            confirmation_method='manual',
            confirm=True,
        )

        return Response({
            'success': True,
            'client_secret': intent.client_secret
        })

    except stripe.error.CardError as e:
        return Response({
            'error': e.error.message
        }, status=400)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=400)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=True, methods=['POST'])
    def process_payment(self, request, pk=None):
        order = self.get_object()
        payment_method = request.data.get('payment_method')
        
        # Create payment record
        payment = Payment.objects.create(
            order=order,
            amount=order.total_amount,
            payment_method=payment_method
        )
        
        # Update order status
        order.status = 'processing'
        order.save()
        
        return Response({'status': 'Payment initiated'}, status=status.HTTP_200_OK)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]