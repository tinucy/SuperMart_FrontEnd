import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { UserRole } from "./interfaces/user.interface";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./pages/admin/admin.module").then((m) => m.AdminPageModule),
    canActivate: [AuthGuard],
    data: { role: UserRole.ADMIN },
  },
  {
    path: "staff",
    loadChildren: () =>
      import("./pages/staff/staff.module").then((m) => m.StaffPageModule),
    canActivate: [AuthGuard],
    data: { role: UserRole.STAFF },
  },
  {
    path: "shop",
    loadChildren: () =>
      import("./pages/shop/shop.module").then((m) => m.ShopPageModule),
    canActivate: [AuthGuard],
    data: { role: UserRole.CUSTOMER },
  },
  {
    path: "wishlist",
    loadChildren: () =>
      import("./pages/wishlist/wishlist.module").then(
        (m) => m.WishlistPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: UserRole.CUSTOMER },
  },
  {
    path: "unauthorized",
    loadChildren: () =>
      import("./pages/unauthorized/unauthorized.module").then(
        (m) => m.UnauthorizedPageModule
      ),
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./pages/cart/cart.module").then((m) => m.CartPageModule),
    canActivate: [AuthGuard],
    data: { role: UserRole.CUSTOMER },
  },
  {
    path: "checkout",
    loadChildren: () =>
      import("./pages/checkout/checkout.module").then(
        (m) => m.CheckoutPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: UserRole.CUSTOMER },
  },
  {
    path: "orders",
    loadChildren: () =>
      import("./pages/order-history/order-history.module").then(
        (m) => m.OrderHistoryPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: UserRole.CUSTOMER },
  },
  // ... other routes
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
