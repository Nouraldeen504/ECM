# orders/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
# from products.models import Product

class OrderViewSet(viewsets.ModelViewSet):
   serializer_class = OrderSerializer
   permission_classes = [IsAuthenticated]

   def get_queryset(self):
       if self.request.user.is_staff:
           return Order.objects.all()
       return Order.objects.filter(user=self.request.user)

   def create(self, request, *args, **kwargs):
       # Extract data from request
       items = request.data.pop('items', [])
       order_data = {
           'shipping_address': request.data.get('shipping_address'),
           'total_amount': request.data.get('total_amount'),
           'payment_method': 'COD',
           'status': 'pending',
           'items': request.data.get('items', [])
       }

       # Create order
       serializer = self.get_serializer(data=order_data, context={'request': request})
       serializer.is_valid(raise_exception=True)
       serializer.save()

    #    # Create order items
    #    for item in items:
    #        product = Product.objects.get(product_id=item['product_id'])
    #        OrderItem.objects.create(
    #            order=order,
    #            product=product,
    #            quantity=item['quantity'],
    #            price=item['price']
    #        )

    #    # Update order with items included in response
    #    serializer = self.get_serializer(order)
       return Response(serializer.data, status=status.HTTP_201_CREATED)

   def update(self, request, *args, **kwargs):
       # Only allow updating order status
       partial = kwargs.pop('partial', False)
       instance = self.get_instance()
       serializer = self.get_serializer(instance, data={'status': request.data.get('status')}, partial=partial)
       serializer.is_valid(raise_exception=True)
       self.perform_update(serializer)
       return Response(serializer.data)

class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
   serializer_class = OrderItemSerializer
   permission_classes = [IsAuthenticated]

   def get_queryset(self):
       return OrderItem.objects.filter(order__user=self.request.user)