import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StaffPage } from './staff.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: StaffPage,
      },
    ]),
  ],
  declarations: [StaffPage],
})
export class StaffPageModule {}
