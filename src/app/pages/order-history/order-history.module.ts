import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { OrderHistoryPage } from './order-history.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OrderHistoryPage,
      },
    ]),
  ],
  declarations: [OrderHistoryPage],
})
export class OrderHistoryPageModule {}
