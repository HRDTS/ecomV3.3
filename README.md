
<h1>Project title:</h1>
<strong>Ecom: a fully mobile optimized, responsive e-commerce store with a third party sellers platform and Stripe payment processing. </strong> <br>

<strong>LIVE: https://ecom-v3.vercel.app/ </strong> <br>

<h2>Screenshot one: </h2><br>

![Screenshot of homepage](https://imgur.com/DzPrEfe)


<h2>Screenshot two: </h2><br>

![Screenshot of category](https://imgur.com/u7XuQuh)

<h2>Screenshot three: </h2><br>

![Screenshot of product page](https://imgur.com/nw89uIy)

<h1>Project Description: </h1><br>
This is an e-commerce store inspired by Amazon, Bol and Coolblue. It is built with React for the front-end and Firebase for the back-end. The Firebase is integrated with Stripe to enable payment processing.  The core concept is to provide an ecosystem for third parties to sell their products on the platform. 

The most important features are:
<h2>Account creation and login enabled by Firebase Authentication</h2><br>
Users can create an account with a username, email and a password. A logged in user can make use of features like the shopping cart, publishing products and leaving ratings for products. 

The account creation form has two validations: one checks if the email is already taken in the Firebase back-end and the other uses Regex for the username to ensure a letter-only string is inputted. There is also a ‘guest login’ provided for express login.

Every account that is created gets stored in the Firebase back-end but also gets a Stripe ID. The Firebase account is thus connected to a Stripe ID, which will be used to allow Stripe payments and store Receipts for the user. 

<h2>Multiple categories and subcategories</h2><br>
Ecom has two categories with each three subcategories. The category Electronics has the subcategories Television, Gaming consoles and Phones. The Books category has the subcategories History, Science and Biography.

<h2>Product filtering</h2><br>
Users can filter products based on 10 different criteria:
1. price
2. ratings
3. delivery option
4. brands
5. screen size
6. chip set
7. memory size
8. author
9. publisher
10. subcategory (if you are in a category)

All filter criteria can be applied at the same time, so a price filter and ratings filter can be applied together. However, not all filters are shown for all products. For example: the chip set filter is not shown when you’re viewing books as this would not be applicable, but it is shown when you are viewing phones. Another important thing about the filters is that criteria such as price, screen size etc have a bottom and top value, so the user can for example filter products from 10 EU to 30 EU.

<h2>Third party sellers platform</h2><br>
This feature emulates the well-known Amazon Third-party-seller system. Third party sellers can contribute to Ecom by publishing their own products. The sellers can choose their own category and subcategory they want to publish their products in. They are required to write all the necessary information such as title, description, price etc. Sellers are required to upload at least 1 image and can upload up to 3 images. 

All the product information is stored in Firebase Realtime Database. The images that the user uploads are stored in Firebase Storage. Firebase Storage images have their own URL’s. These URL’s are stored as product data, so that it can be rendered along with the product information.

<h2>Shopping cart</h2> <br>
Users can add products to their shopping cart by going to a product page, selecting the quantity (1 to 10) and then clicking on ‘add to cart’. Another way is to go to the shopping cart and adjust the quantity with the plus and minus buttons or the input field (which allows a custom input). Of course, there needs to be a product in the shopping cart in the first place to do this. The total quantity and price are calculated there as well. 

The shopping cart has a reset button to delete everything and a ‘proceed to payment’ button. 

The shopping cart is basically a state where everything is stored. I used the library Zustand for State Management. This is the first state management I ever used, so I needed to get used to the idea of being able to import the state to whatever component I need it in.

<h2>Stripe payment processing and product Receipts</h2><br>
Stripe payment processing allows users to ‘pay’ for the content of their shopping cart. A test payment can be made with the card number: 4242 4242 4242 4242. The contents of the shopping cart will be shown on the Stripe payment page along with the email that the user inputted during registration. After the user completed the payment, he/she returns to the Ecom homepage and the receipts will be stored in the Receipts page.

Adding Stripe to my project came with some complexities. First I needed to make sure that every user has a Stripe ID attached to their Firebase Account. The Stripe Receipts can only be called if I know the Stripe ID of the Firebase user. The second thing I needed to do is to add the product information of all my individual products from Firebase to Stripe. So each time a product is created by the user, the products information will be stored in Firebase AND Stripe. This information on the Stripe back-end can be used to allow images etc on the Stripe payment page. 

<h2>Rating system</h2><br>
All the products have their own rating, from 1 star to 5 stars. The average rating and the total ratings will be displayed on the places where the product is displayed (category, subcategory and product page). If two users leave a rating, say  5 stars and 2 stars, the average will be 7 divided by 2 = 3,5 stars. This average will be rounded up to 4 stars. Later on, when the user filters products on 4 stars or more, this product will show up.

All the ratings are stored in the Firebase Realtime Database. 

<h2>Search bar</h2><br>
There is a search bar feature that users can use to find categories and subcategories. I am using the library ReactSearchAutoComplete for this. This feature does exactly what one would expect it to do: auto complete whatever the user searches. For now I have only added categories and subcategories to be auto completed, but later I would like to add products as well. 

<h2>Extras</h2><br>
A couple of things worth mentioning but not deserving of their own bulletpoints will be listed here.
<strong>responsiveness</strong>
Ecom was initially desktop only, but I decided to add mobile optimization and responsiveness to it. The application is optimized up to 280px width (Galaxy Fold). All the homepage tiles will adjust to fit neatly on the screen. The header, category, subcategory and product page will adjust as well. The header turns into a hamburger menu. The filter bar that is normally displayed on the left side will turn into a small button. When clicked, it unfolds and overlaps the screen, allowing the user to easily use the filter bar. The product page has a slightly distinct layout when displayed on the mobile.<br>

<strong>Amazon product page</strong>
I emulated the Amazon product page where there is one big image and an array of smaller images. When the smaller images are hovered over, the hovered over image will be displayed as a big image until the mouse leaves the smaller image. When the smaller image is clicked on, it will be shown as the big image even if the mouse leaves the smaller image.<br>
  
<strong>Image slider on the homepage</strong>
The image slider on the homepage came with some stubborn complexities. The images in the image slider are not the same size, so when the images change from – say -  image 1 to image 2, the image slider would adjust it’s height based on the child image, shifting the contents of the homepage along with it. I decided to fix the height of the image slider. I had to add some media queries to make it responsive. If you go to my homepage and adjust the size of the browser, you will see that the image slider adjusts it’s size neatly along with the rest of the homepage contents. 

<strong>Personal note:</strong>
A big e-commerce project has always been on my mind since the early days of my programming journey. E-commerce is one of my passions. Combining my passion for programming with my passion for e-commerce was truly an amazing experience and it made me want to go the extra mile. Doing this project made me aware of how important foresight is. Being able to foresee potential problems early on, and coding with the future more in mind makes everything easier and saves a lot of time.<br>

Please feel free to reach out to me with any feedback or questions you may have. I am always happy to connect with fellow developers and share my experiences.

If you find your image in this or any other of my projects and you do not want it to be used, please contact me at t.genc58@hotmail.com. I will promptly remove the image upon request.
Thank you.





