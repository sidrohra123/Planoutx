import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { AuthPage } from './auth/auth.page';
import { NewsfeedPage } from './trending/newsfeed/newsfeed.page';
import { OffersPage } from './tabs/offers/offers.page';
import { NotificationsPage } from './tabs/notifications/notifications.page';
import { TutorialsPage } from './tutorials/tutorials.page';
import { CategoriesPage } from './categories/categories.page';
import { BlogPage } from './blog/blog.page';
import { BlogdetailsPage } from './blogdetails/blogdetails.page';
import { CartPage } from './cart/cart.page';
import { ProductsPage } from './products/products.page';
import { ProductDetailsPage } from './product-details/product-details.page';
import { LocationsPage } from './locations/locations.page';
import { EveyrthingPage } from './eveyrthing/eveyrthing.page';
import { CalendarPage } from './calendar/calendar.page';
import { ProfilePage } from './profile/profile.page';
import { TrendingPage } from './trending/trending.page';
import { IdeasPage } from './trending/ideas/ideas.page';
import { TiktokPage } from './trending/tiktok/tiktok.page';
import { VideosPage } from './trending/videos/videos.page';
import { PassportPage } from './passport/passport.page';
import { ContentPage } from './content/content.page';
import { OccasionsPage } from './occasions/occasions.page';
import { CheckoutPage } from './checkout/checkout.page';
import { RefernearnPage } from './refernearn/refernearn.page';
import { FilterPage } from './filter/filter.page';
import { WeightPage } from './filter/weight/weight.page';
import { PricePage } from './filter/price/price.page';
import { EnterpincodePage } from './enterpincode/enterpincode.page';
import { ChatsupportPage } from './chatsupport/chatsupport.page';
import { AddnewaddressPage } from './addnewaddress/addnewaddress.page';
import { PaymentOptionsPage } from './payment-options/payment-options.page';
import { SavedAddressPage } from './saved-address/saved-address.page';
import { OrdersummaryPage } from './ordersummary/ordersummary.page';
import { UserordersPage } from './userorders/userorders.page';
import { OrderDetailsPage } from './order-details/order-details.page';
import { SavedaddressesprofilePage } from './savedaddressesprofile/savedaddressesprofile.page';
import { EditAddressProfilePage } from './edit-address-profile/edit-address-profile.page';
import { AddAddressProfilePage } from './add-address-profile/add-address-profile.page';
import { WallethistoryPage } from './wallethistory/wallethistory.page';
import { WishlistPage } from './wishlist/wishlist.page';
import { UpdateprofilePage } from './updateprofile/updateprofile.page';
import { MembershipdetailsPage } from './membershipdetails/membershipdetails.page';
import { AvailcakesPage } from './passport/availcakes/availcakes.page';
import { CakedetailsPage } from './passport/availcakes/cakedetails/cakedetails.page';
import { MycouponsPage } from './profile/mycoupons/mycoupons.page';
import { SitemapPage } from './sitemap/sitemap.page';
import { AddonsPage } from './addons/addons.page';
import { OrderfailedPage } from './orderfailed/orderfailed.page';

const routes: Routes = [
  {path:'tutorials', component:TutorialsPage},
  {path:'', component:HomePage, pathMatch:'full'},
  {path:'login', component:AuthPage},
  { path: 'trending', component:TrendingPage, children:[
    {path:'newsfeed', component:NewsfeedPage},
    {path:'ideas', component:IdeasPage},
    {path:'tiktok', component:TiktokPage},
    {path:'videos', component:VideosPage},
  ]},
  { path: 'offers', component:OffersPage},
  { path: 'notifications', component:NotificationsPage},
  { path: 'categories', component:CategoriesPage },
  { path: 'categories/:id', component:CategoriesPage },
  { path: 'categories/:id/:subId', component:CategoriesPage },
  { path: 'blog', component:BlogPage },
  { path: 'blogDetails/:id',component:BlogdetailsPage },
  { path: 'cart', component:CartPage },
  { path: 'products', component:ProductsPage },
  { path: 'product/:name', component:ProductDetailsPage },
  { path: 'addons/:prodid', component:AddonsPage },
  { path: 'locations', component:LocationsPage },
  { path: 'eveyrthing', component:EveyrthingPage },
  { path: 'shop/:category', component:EveyrthingPage },
  { path: 'shop/:category/:subcategory', component:EveyrthingPage },
  { path: 'shop/:category/:subcategory/:subsubcategory', component:EveyrthingPage },
  { path: 'shop/:ocassion', component:EveyrthingPage },
  { path: 'shop/:ocassion/:subocassion', component:EveyrthingPage },
  { path: 'calendar', component:CalendarPage },
  { path: 'profile', component:ProfilePage },
  { path: 'ideas', component:IdeasPage },
  { path: 'videos', component:VideosPage },
  { path: 'tiktok', component:TiktokPage },
  { path: 'passport', component:PassportPage },
  { path: 'content/:pageId', component:ContentPage },
  { path: 'occasions', component:OccasionsPage },
  { path: 'checkout', component:CheckoutPage },
  { path: 'refernearn', component:RefernearnPage },
  { path: 'filter', component:FilterPage},
  { path: 'filter/flavours', component:WeightPage },
  { path: 'filter/price', component:PricePage },
  { path: 'enterpincode', component:EnterpincodePage },
  { path: 'chatsupport', component:ChatsupportPage },
  { path: 'addnewaddress', component:AddnewaddressPage },
  { path: 'payment-options', component:PaymentOptionsPage },
  { path: 'saved-address', component:SavedAddressPage },
  { path: 'thankyou/summary/:id', component:OrdersummaryPage },
  { path: 'orderfailed/summary/:id', component:OrderfailedPage },
  { path: 'profile/userorders', component:UserordersPage },
  { path: 'profile/userorders/order-details/:id', component:OrderDetailsPage },
  { path: 'profile/savedaddresses', component:SavedaddressesprofilePage },
  { path: 'profile/editaddress', component:EditAddressProfilePage },
  { path: 'profile/addnewaddress', component:AddAddressProfilePage },
  { path: 'profile/wallethistory', component:WallethistoryPage },
  { path: 'profile/wishlist', component:WishlistPage },
  { path: 'profile/updateprofile', component:UpdateprofilePage },
  { path: 'profile/mycoupons', component:MycouponsPage },
  { path: 'membershipdetails/summary/:id', component:MembershipdetailsPage },
  { path: 'passport/availcakes', component:AvailcakesPage },
  { path: 'passport/availcakes/:cakeName', component:CakedetailsPage },
  { path: 'sitemap', component:SitemapPage }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, scrollPositionRestoration:'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
