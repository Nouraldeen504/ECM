# products/admin_views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from users.models import User
from products.models import Product
from orders.models import Order
from rest_framework import serializers

# First, create a serializer for the response
class DashboardStatsSerializer(serializers.Serializer):
    totalUsers = serializers.IntegerField()
    totalProducts = serializers.IntegerField()
    totalOrders = serializers.IntegerField()
    totalRevenue = serializers.FloatField()
    recentOrders = serializers.ListField()
    lowStockProducts = serializers.ListField()

class AdminViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = DashboardStatsSerializer

    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """
        Get dashboard statistics including:
        - Total users count
        - Total products count
        - Total orders count
        - Total revenue
        - Recent orders
        - Low stock products
        """
        total_users = User.objects.count()
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(
            total=Sum('total_amount')
        )['total'] or 0

        recent_orders = Order.objects.select_related('user').order_by('-order_date')[:5]
        recent_orders_data = [{
            'id': order.order_id,
            'customer': f"{order.user.first_name} {order.user.last_name}".strip() or order.user.email,
            'total': float(order.total_amount),
            'date': order.order_date.strftime("%Y-%m-%d %H:%M")
        } for order in recent_orders]

        low_stock = Product.objects.filter(stock_quantity__lt=10).order_by('stock_quantity')[:5]
        low_stock_data = [{
            'id': product.product_id,
            'name': product.name,
            'sku': f'SKU-{product.product_id}',
            'stock': product.stock_quantity
        } for product in low_stock]

        data = {
            'totalUsers': total_users,
            'totalProducts': total_products,
            'totalOrders': total_orders,
            'totalRevenue': float(total_revenue),
            'recentOrders': recent_orders_data,
            'lowStockProducts': low_stock_data
        }

        serializer = self.get_serializer(data)
        return Response(serializer.data)

    def list(self, request):
        """
        List available admin endpoints.
        """
        return Response({
            'dashboard_stats': 'Get dashboard statistics',
        })