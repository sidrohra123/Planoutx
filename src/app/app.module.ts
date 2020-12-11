import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { HomePage } from './home/home.page';
import { AuthPage } from './auth/auth.page';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TabsComponent } from './tabs/tabs.component';
import { NewsfeedPage } from './trending/newsfeed/newsfeed.page';
import { NotificationsPage } from './tabs/notifications/notifications.page';
import { OffersPage } from './tabs/offers/offers.page';
import { Toast } from '@ionic-native/toast/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { TutorialsPage } from './tutorials/tutorials.page';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { CategoriesPage } from './categories/categories.page';
import { BlogPage } from './blog/blog.page';
import { BlogdetailsPage } from './blogdetails/blogdetails.page';
import { CartPage } from './cart/cart.page';
import { ProductsPage } from './products/products.page';
import { ProductDetailsPage } from './product-details/product-details.page';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { FormsModule } from '@angular/forms';
import { LocationsPage } from './locations/locations.page';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { EveyrthingPage } from './eveyrthing/eveyrthing.page';
import { CalendarPage } from './calendar/calendar.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { ProfilePage } from './profile/profile.page';
import { TrendingPage } from './trending/trending.page';
import { IdeasPage } from './trending/ideas/ideas.page';
import { TiktokPage } from './trending/tiktok/tiktok.page';
import { VideosPage } from './trending/videos/videos.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PassportPage } from './passport/passport.page';
import { ContentPage } from './content/content.page';
import { OccasionsPage } from './occasions/occasions.page';
import { SortProductsComponent } from './eveyrthing/sort-products/sort-products.component';
import { FilterProductsComponent } from './filter-products/filter-products.component';
import { CheckoutPage } from './checkout/checkout.page';
import { CardpreviewComponent } from './cardpreview/cardpreview.component';
import { RefernearnPage } from './refernearn/refernearn.page';
import { FilterPage } from './filter/filter.page';
import { WeightPage } from './filter/weight/weight.page';
import { PricePage } from './filter/price/price.page';
import { EnterpincodePage } from './enterpincode/enterpincode.page';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
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
import { LottieAnimationViewModule } from 'ng-lottie';
import { RequestinterceptorService } from './requestinterceptor.service';
import { AvailcakesPage } from './passport/availcakes/availcakes.page';
import { CakedetailsPage } from './passport/availcakes/cakedetails/cakedetails.page';
import { UrlSlugPipe } from './url-slug.pipe';
import { MycouponsPage } from './profile/mycoupons/mycoupons.page';
import { QRCodeModule } from 'angularx-qrcode';
import { SitemapPage } from './sitemap/sitemap.page';
import { OtherplansPage } from './passport/otherplans/otherplans.page';
import { DesktopfooterPage } from './desktopfooter/desktopfooter.page';
import { DesktopProductPage } from './desktop-product/desktop-product.page';
import { AddonsPage } from './addons/addons.page';
import { OrderfailedPage } from './orderfailed/orderfailed.page';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    TabsComponent,
    NewsfeedPage,
    NotificationsPage,
    OffersPage,
    HomePage,
    TutorialsPage,
    CategoriesPage,
    BlogPage,
    BlogdetailsPage,
    CartPage,
    AuthPage,
    ProductsPage,
    ProductDetailsPage,
    LocationsPage,
    EveyrthingPage,
    CalendarPage,
    ProfilePage,
    TrendingPage,
    NewsfeedPage,
    IdeasPage,
    TiktokPage,
    VideosPage,
    SkeletonComponent,
    PassportPage,
    ContentPage,
    OccasionsPage,
    SortProductsComponent,
    FilterProductsComponent,
    CheckoutPage,
    RefernearnPage,
    FilterPage,
    WeightPage,
    PricePage,
    CardpreviewComponent,
    EnterpincodePage,
    ChatsupportPage,
    AddnewaddressPage,
    PaymentOptionsPage,
    SavedAddressPage,
    OrdersummaryPage,
    UserordersPage,
    OrderDetailsPage,
    SavedaddressesprofilePage,
    EditAddressProfilePage,
    AddAddressProfilePage,
    WallethistoryPage,
    WishlistPage,
    UpdateprofilePage,
    MycouponsPage,
    MembershipdetailsPage,
    AvailcakesPage,
    CakedetailsPage,
    UrlSlugPipe,
    SitemapPage,
    OtherplansPage,
    DesktopfooterPage,
    DesktopProductPage,
    AddonsPage,
    OrderfailedPage
  ],
  entryComponents: [
    SortProductsComponent,
    FilterProductsComponent,
    CardpreviewComponent,
    OtherplansPage,
    DesktopfooterPage,
    DesktopProductPage
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    IonicModule.forRoot({
      mode:'ios'
    }),
    SwiperModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FilterPipeModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    GooglePlaceModule,
    LottieAnimationViewModule.forRoot()
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    Contacts,
    YoutubeVideoPlayer,
    HttpClient,
    Toast,
    Facebook,
    NativeStorage,
    GooglePlus,
    NativeGeocoder,
    SocialSharing,
    {provide: HTTP_INTERCEPTORS, useClass: RequestinterceptorService, multi: true},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
