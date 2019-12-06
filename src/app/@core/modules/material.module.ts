import { NgModule } from '@angular/core';

import {
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule
} from '@angular/material';

const MaterialModulesArray = [
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule
]

@NgModule({
  imports: MaterialModulesArray,
  exports: MaterialModulesArray,
})

export class MaterialModule {}
