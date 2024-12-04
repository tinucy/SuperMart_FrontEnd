import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { WishlistPage } from './wishlist.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: WishlistPage,
      },
    ]),
  ],
  declarations: [WishlistPage],
})
export class WishlistPageModule {}
