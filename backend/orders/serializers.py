# orders/serializers.py
import logging
from rest_framework import serializers
from .models import Order, OrderItem #, Payment

logger = logging.getLogger(__name__)

class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'product', 'quantity', 'price', 'product_id']
        read_only_fields = ['order_item_id', 'product']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ['order_id', 'user', 'order_date', 'status', 'total_amount', 
                 'shipping_address', 'payment_method', 'items']
        read_only_fields = ['order_id', 'user', 'order_date']
    
    def create(self, validated_data):
        logger.info(f"Validated Data: {validated_data}")

        # Extract items data from validated_data
        items_data = validated_data.pop('items', [])
        logger.info(f"Items Data: {items_data}")
        
        validated_data['user'] = self.context['request'].user

        # Create the Order instance
        order = Order.objects.create(**validated_data)
        logger.info(f"Order Created: {order}")

        # Create OrderItem instances for each item in items_data
        for item_data in items_data:
            # Map product_id to product
            product_id = item_data.pop('product_id')
            item_data['product_id'] = product_id
            OrderItem.objects.create(order=order, **item_data)
            logger.info(f"OrderItem Created: {item_data}")
        
        return order

# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Payment
#         fields = '__all__'