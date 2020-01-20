$(document).ready(function(){
    var form = $('#form_buying_product');

    $('#select_city').click(function() {
        var city = $("#select_city option:selected").val();
        var data = {};
        data.city = city;
        var url = "/select_city/";
        var csrf_token = $('#select_city [name="csrfmiddlewaretoken"]').val();
        data["csrfmiddlewaretoken"] = csrf_token;

        $.ajax({
             url: url,
             type: 'POST',
             data: data,
             cache: true,
             success: function(){
             },
             error: function(){
             }
         })
    });


    function basketUpdating(product_id, nmb, is_delete){
        var data = {};
        data.product_id = product_id;
        data.nmb = nmb;
        var csrf_token = $('#form_buying_product [name="csrfmiddlewaretoken"]').val();
        data["csrfmiddlewaretoken"] = csrf_token;

        if (is_delete){
            data["is_delete"] = true;
        }
        var url = form.attr("action");

         $.ajax({
             url: url,
             type: 'POST',
             data: data,
             cache: true,
             success: function (response_dict) {
                 if (response_dict.products_total_nmb || response_dict.products_total_nmb == 0){
                     $('#basket_total_nmb').text("("+response_dict.products_total_nmb+")");
                     $('.basket-items ul').html("");
                     $.each(response_dict.products, function(key, value){
                        $('.basket-items ul').append('<li>'+ value.name+', ' + value.nmb + 'шт. ' + 'по ' + value.price_per_item + 'Р.  ' +
                            '<a class="delete-item" href="" data-product_id="'+ value.id+'">x</a>'+
                            '</li>');
                     });
                 }
             },
             error: function(){
                 console.log("error")
             }
         })

    }

    form.on('submit', function(e){
        e.preventDefault();
        var nmb = $('#number').val();
        var submit_btn = $('#submit_btn');
        var product_id =  submit_btn.data("product_id");
        basketUpdating(product_id, nmb, is_delete=false)

    });

    function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
    var cookie = jQuery.trim(cookies[i]);
    // Does this cookie string begin with the name we want?
    if (cookie.substring(0, name.length + 1) == (name + '=')) {
    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    break;
    }
    }
    }
    return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
    beforeSend: function (xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
    }
    });



    function showingBasket(){
        $('.basket-items').toggleClass('hidden');
    };

    $('.basket-container').on('click', function(e){
       e.preventDefault();
       showingBasket();
    });

     $(document).on('click', '.delete-item', function(e){
         e.preventDefault();
         product_id = $(this).data("product_id")
         nmb = 0;
         basketUpdating(product_id, nmb, is_delete=true)
     });


    function calculatingBasketAmount() {
        var total_order_amount = 0;
        $('.total_product_in_basket_amount').each(function () {
            total_order_amount += parseFloat($(this).text());
        });
        $("#total_order_amount").text(total_order_amount.toFixed(2));
    }

    $(document).on('change', '.product_in_basket_nmb', function () {
        var current_nmb = $(this).val();
        var current_product_tr = $(this).closest('tr');
        var current_price = parseFloat(current_product_tr.find('.product_in_basket_price').text()).toFixed(2);
        var total_amount = parseFloat(current_nmb * current_price).toFixed(2);
        current_product_tr.find('.total_product_in_basket_amount').text(total_amount);
        calculatingBasketAmount();
    });



    calculatingBasketAmount();
});