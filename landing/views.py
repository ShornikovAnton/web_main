from django.shortcuts import render
from .forms import SubscriberForm
from products.models import *


def home(request):
    session_key = request.session.session_key
    if not session_key:
        request.session.cycle_key()

    if 'city' in request.COOKIES.keys():
        city = request.COOKIES.get("city")
        products_images = ProductImage.objects.filter(product__city=city, is_active=True, is_main=True, product__is_active=True)

    else:
        products_images = ProductImage.objects.filter(is_active=True, is_main=True, product__is_active=True)
    return render(request, 'landing/home.html', locals())
