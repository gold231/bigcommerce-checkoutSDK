# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2020-02-07
#### Added
- We want you to control the lazy loading of your images so we added theme
  settings so you can do just that

#### Changed
- We changed most images to use the srcset allowing the right size image to be
  loaded for your shoppers no matter what device they are on

#### Fixed
- New customer information is no longer hard to read on the luxe preset

## [2.0.4] - 2020-01-07
#### Changed
- The cookie banner for EU stores and shoppers now appears at the bottom of the
  view port so it can't be missed

## [2.0.3] - 2019-12-12
#### Fixed
- The EU cookie notification bar was showing in places other than the EU when
  that's the only place it should be showing
- The styles to support apple pay went missing somewhere, now they are back and
  apple pay is usable again

## [2.0.2] - 2019-12-04
#### Added
- We added support for the EU notification bar, now if you're in the EU you can
  let people know there are cookies around

#### Fixed
- File fields didn't always show right on returns pages so we changed it us and
  now they do.

## [2.0.1] - 2019-11-01
#### Fixed
- We now avoid showing an error on the gift certificate purchase page
  (fixes THEME-1762)
- Complex product descriptions now display correctly for structured data
- You will no longer receive JS errors on AMP pages (fixes THEME-1767)
- Options that were unavailable, but still visible are now styled to make it
  more obvious that they are unavailable

## [2.0.0] - 2019-09-05
#### Added
- Regions are needed to support widgets when they become available so we added
  support for them

#### Fixed
- No one likes saying the wrong thing at the wrong time, so when someone pointed
  out that we were about how many reviews there were, we fixed it and pulled our
  foot out of our mouth

#### Changed
- Webpack updated to use version 4, you shouldn't notice anything different
  because of it (fixes THEME-1850)

## [1.7.3] - 2019-08-27
#### Changed
- Our support documents moved and we updated the address so you can get there
  now

## [1.7.2] - 2019-08-01
#### Changed
- jQuery updated to maintain security

## [1.7.1] - 2019-04-11
#### Fixed
- Because of how we have to write the structured data for breadcrumbs, they just
  don't play well with AMP pages because they have to have JS in them so we
  removed them

## [1.7.0] - 2019-03-21
#### Changed
- Updated Stencil Utils version to support CSRF

#### Added
- Support for CSRF protection
- The basic functionality of Google Enhanced Ecomm is now supported
- Hey! Ever get to the cart and realize that t-shirt is actually too big,
  well you can now change options in the cart and get a small (THEME-942)

#### Fixed
- Now shoppers can reorder items in a order even when one of the items from the
  order is out of stock (THEME-1519)

## [1.6.2] - 2019-01-24
#### Added
- Support for vaulted credit cards if you'd like them

## [1.6.1] - 2019-01-16
#### Fixed
- We removed the weird scroll bars on the breadcrumbs

## [1.6.0] - 2019-01-10
#### Changed
- Implemented new pricing structure, sale badges are now controlled by
  sale price and not the existence of a retail price. (THEME-1541)
- Changed "As low as" wording to price ranges for product options. It's more
  descriptive and works regardless of the default.

#### Fixed
- Don't show a default price on quick-shop if there isn't one.
- Customer group discounts now show on quick-view (fixes THEME-1611)
- Thumbnail is no longer added when a variant with image is selected
  (fixes THEME-1478)
- Variant image disapears when another variant is selected

#### Added
- Price label settings

## [1.5.6] - 2018-10-18
#### Fixed
- Product filters didn't fit very well on all screensizes, so we mixed it up and
  fixed it up, it looks better now (fixes THEME-1658)

#### Added
- Support for Smart PayPal buttons

## [1.5.5] - 2018-09-20
#### Fixed
- The Pinterest share button wasn't sharing much at all, but we took a look and
  cleaned out the pipes so all the information flows now
- Shipping and promo messages we're showing up on the homepage which isn't very
  useful when you are trying to upsell, we found them and are showing them now.
  Would you like fries with that? (fixes THEME-1459)

## [1.5.4] - 2018-08-23
#### Added
- Now if your shoppers want to ship to multiple addresses in one order and you
  have it set up in your admin, they can! Cyber Monday here we come

## [1.5.3] - 2018-07-12
#### Fixed
- The related products on your product pages were showing the price of the
  product they were related to not their own price, we fixed that up so now they
  show the correct price (fixes THEME-1626)

## [1.5.2] - 2018-06-20
#### Fixed
- Price jumps aren't usually a good thing, so we stoped the price from jumping
  around on the page (fixes THEME-1573)
- Mobile iOS users may have noticed a problem if they tried to add a product to
  the cart that had an optional file upload that they left empty. No more! All
  add to carts work as expected (fixes THEME-1605)
- There was a feature missing in the features list that was making it so the
  new script manager wasn't working, but now it's not missing anymore
  (fixes THEME-1607)
- The price range filter on faceted search wasn't playing nicely with the search
  query and no results were being returned, that's all fixed now
  (fixes THEME-1580)
- The tabs on the product pages were causing some display oddities on mobile, we
  corrected the issues so it should be smooth scrolling from here on out

### [1.5.1] - 2018-05-14
#### Changed
- Our packages have moved to a sunny beach on github, so we had to update their
  links in the package.json file

#### Fixed
- BC doesn't make the price ranges available on the search pages when there is
  no product filtering on, so we removed the empty price drop down to reduce
  confusion.

### [1.5.0] - 2018-05-31
#### Added
- BC has you covered for GDPR, they added a control panel setting that lets you
  add a summary to the newsletter section of your storefront and Brixton can now
  show that summary, handy!

#### Changed
- The cart qty selector was a little small and you couldn't see a three digit
  number, now you can! You're welcome

## [1.4.0] - 2018-05-10
#### Added
- AMP product pages are now available on Brixton, hip hip hurray!

## [1.3.9] - 2018-04-27
#### Fixed
- We made a change a little while ago and missed the mobile review tab, that's
  fixed so your reviews are visible on mobile once again

## [1.3.8] - 2018-04-26
#### Fixed
- There is a custom out of stock message for a reason in the control panel, you
  want to use it! Well now the theme supports it on the product page and on the
  product list pages (fixes THEME-1531)

## [1.3.7] - 2019-04-19
#### Fixed
- The Google confused us by having two AMP validator tools that returned
  different results. We are all on the same page now though, so happy AMPing

## [1.3.6] - 2018-04-12
#### Added
- Pictures are nice, but sometimes you need words to get your point across,
  brand names are now available on the brands page even if you have a brand image

#### Fixed
- The brands pages wasn't working with infinite scroll and it's pagination was
  hiding because it doesn't like infinite scroll, now it all works and your brands are once again discoverable
- If your product only has one image, you don't need to navigate through it,
  so we removed the extraneous thumbnail, it wasn't as painful as it sounds

#### Changed
- We got a little too gung-ho in our last update, now only the navigation item
  that will show as active is the one that is being viewed, not the entire path
  to get there

## [1.3.5] - 2018-04-05
#### Fixed
- Asking for reviews on your products is only useful if the link you provide
  shoppers with works. We have fixed up the product page to allow the review
  modal to open when that link is clicked. Now go get those reviews!
  (fixes THEME-1553)

## [1.3.4] - 2018-03-29
#### Added
- Header and footer scripts are now supported on the checkout and order
  confirmation pages

## [1.3.3] - 2018-03-22
#### Fixed
- Correct variables to match new core amp variables


## [1.3.2] - 2018-03-15
#### Fixed
- You can't filter something by filters you can't see. Now if you are using
  faceted search, your filters will stay open and allow you to scroll
- When you had a list in your product descriptions or pages, they were missing
  their styles, we found them and put them back where they belong
- Not everyones fingers are the same size, so it's a good idea to make tappable
  areas big enough for even the most dainty of lady fingers. The AMP nav close
  will no longer discriminate

## [1.3.1] - 2018-03-08
#### Added
- AMP support for theme color options, integration with theme cart icon and social
  links, now AMP pages will look more like the theme you know and love

## [1.3.0] - 2018-03-01
#### Added
- If you use GeoTrust seals for your store, it's easier to add it to your storefront
  through theme settings now

## [1.2.0] - 2018-02-28
#### Added
- Keeping your theme up to the latest practices, Brixton now supports Google AMP
  category pages for faster browsing from google searches

## [1.1.0] - 2018-02-15
#### Changed
- We updated webpack to version 3. Don't see anything different? Excellent, you
  shouldn't

#### Fixed
- Swatches were not staying in their area on IE, that's all fixed now

## [1.0.11] - 2018-02-08
#### Added
- You can now choose to display 3, 4 or 6 related products on your product page

#### Fixed
- The brands page was missing pagination so if you had over 50 brands your users
  couldn't see all of them. We have remedied the situation and shoppers can browse
  with ease.
- The related product images weren't getting the information they needed, we
  cleared the lines of communication and all is well now

## [1.0.10] - 2018-02-01
#### Fixed
- The more filters menu was always missing one facet. We've corrected our math
  so that doesn't happen any more
- There was some horizontal scrolling where there shouldn't be on Safari, that's
  been taken care of
- On iPads the sidebar didn't always stay inside the lines, now it will.

#### Changed
- There was some weird layout stuff happening on account pages with banners, we
  adjusted it to look more uniform

## [1.0.9] - 2018-01-18
#### Added
- Product stock is now visible for products with product options. How many times
  can I say product?

#### Fixed
- When you set things to be hidden, they should be now sold out options are hidden
  on all browsers when you want them to be

## [1.0.8] - 2018-01-04
#### Fixed
- Some weird stuff was happening with select elements on Firefox, it has been
  un-weirded

## [1.0.7] - 2017-12-20
#### Fixed
- Found you, haha! Now you know where you are too within your stores navigation.
  Navigation panels stay open to the place you are looking

## [1.0.6] - 2017-12-14
#### Added
- Feature list updated to include "Optimized for Pixelpop", now you know

#### Fixed
- Start from the top! That's what we told catalog pages, so now when you navigate
  using regular old pagination you will get sent to the top of the page, not the
  bottom (fixes THEME-1489)

## [1.0.5] - 2017-12-07
#### Fixed
- A package was causing compare to break, it is broken no more
- Once upon a time there was a required checkbox that made all the other checkboxes
  required, then a developer is shinning armor logged in and put that checkbox in
  it's place. The End
- Account address fields look nice all the time now
- State field required toggle only toggles if it's supposed to no more random acts
  of toggling
- Sharing now possible from quick shop
- Print those products to share them around the office, plaster them on your wall,
  though we recommend saving the trees and keeping it all digital

#### Changed
- Checkboxes should look like checkboxes all over the theme, they do now
- If someone errors on the contact form, the error wont make it look like the
  theme messed up too any more
- Funky colors are fun, but only when you choose them. The lighter text elements
  are now more closely matched to the text color then before for aesthetic appeal

## [1.0.4] - 2017-11-09
#### Changed
- If you know it might break fix it! That's what I always say. We did just that
  by updating stencil-utils to v1.0.9

#### Added
- Not sure what color you want? That's ok, now you can change your mind and select
  none as an option for optional product options without having to refresh the
  page

#### Fixed
- The theme looks nice even on IE now, go ahead, take a look

## [1.0.3] - 2017-11-02
#### Fixed
- No one likes it when someone else moves their stuff, now the catalog utils bar
  stays put when the quickview modals load
- Go ahead, use that third party gift certificate app you've been looking at, no
  longer will your custom codes be blocked by the theme
- Quick view a collection? That doesn't make sense, quick view overlay removed
  from featured collection
- Don't you hate it when browsers add in their own little flare? Us too, now you
  wont find that happening with number inputs on Firefox
- Removing the last product from the cart with the quantity inputs wont leave you
  hanging any more, removing the product correctly and showing the empty cart
  message
- It's all lining up. In related products with product options that switch the
  image, the correct image displays in the main image area now.

## [1.0.2] - 2017-10-04
#### Added
- Decide what your shoppers see, theme toggle to hide the additional information
  tab added for your convenience

#### Fixed
- Seeing stars? That's ok at least you are seeing them all in the same place now
  on the product pages
- No one likes crumbs going where they aren't supposed to. So we fixed up the
  breadcrumbs so they don't overflow their container ever
- Lost no more, on the product page you can tell exactly where you are on the
  image thumbnail list when scrolling through the product images
- Social links and brand links had lost their way in the mobile sidebar view,
  we found them again and made it so they will be lost no more
- There is nothing wrong with being all matchy matchy, now the tabs and their
  toggles match up correctly on product pages
- Go anywhere you want now on your tablet, well at least on your Brixton store,
  all navigation links are visible through scrolling
- IE forced to render in non-compatibility mode because, let's be honest, it
  wasn't that compatible, caution it doesn't always work
- No more seeing double prices, theme updated to show savings once and only once

#### Changed
- Blog aspect default setting changed for warm, now those images just have a
  little something, something to take it to the next level
- No more weird pictures hanging out, bc-zoom updated to use v1.0.2 so lightbox
  images don't end up creeping on the page when they aren't supposed to

## [1.0.1] - 2017-09-21

#### Fixed
- Config reference to Classic demo link updated
