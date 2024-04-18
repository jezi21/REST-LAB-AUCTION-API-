import stripe
FRONTEND_URL = "http://localhost:3000"

stripe.api_key = open("payment_api/stripe_key.txt", "r").read()


def create_product(auction):
    product = stripe.Product.create(
        name=auction["title"],
        description=auction["description"],
        images=[auction["image"]],
    )
    price = stripe.Price.create(
        unit_amount=auction["price"],
        currency='usd',
        product=product.id,
    )
    return price.id

def creeate_checkout_session(price_id):
    checkout_session = stripe.checkout.Session.create(
        line_items=[
            {
                'price': price_id,
                'quantity': 1,
            },
        ],
        mode='payment',
        success_url=FRONTEND_URL + '/success.html',
        cancel_url=FRONTEND_URL + '/cancel.html',
    )
    return checkout_session

def create_checkout_session():
    auction ={
        "title": "test",
        "description": "test",
        "image": "https://via.placeholder.com/150",
        "price": 100,
        "end_date": "2021-09-01 00:00:00",
        "current_bidder_id": 1
    }
    
    price_id =  create_product(auction)
    checkout_session =  creeate_checkout_session(price_id)

    print(checkout_session)
    print(checkout_session)
  




    print(checkout_session.url)

create_checkout_session()