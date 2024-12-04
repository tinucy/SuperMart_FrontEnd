import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ShopPage } from './shop.page';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShopPage,
      },
    ]),
  ],
  declarations: [ShopPage],
})
export class ShopPageModule {}
