import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UnauthorizedPage } from './unauthorized.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UnauthorizedPage,
      },
    ]),
  ],
  declarations: [UnauthorizedPage],
})
export class UnauthorizedPageModule {}
