# ecommerce_project/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from products.views import ProductViewSet, CategoryViewSet
from products.admin_views import AdminViewSet
from cart.views import CartViewSet
from orders.views import OrderViewSet, PaymentViewSet, process_payment

router = DefaultRouter()
router.register(r'admin', AdminViewSet, basename='admin')
router.register(r'users', UserViewSet)
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/payment/process/', process_payment, name='process_payment'),
    path('api/users/', include('users.urls')),
]