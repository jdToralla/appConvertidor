import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateAreaComponent } from './components/calculate-area/calculate-area.component';
import { ConvertComponent } from './components/convert/convert.component';
import { GraphComponent } from './components/graph/graph.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes =  [
  {path: 'home', component: HomeComponent},
  {path: 'calculate-area', component: CalculateAreaComponent},
  {path: 'convert', component: ConvertComponent},
  {path: 'graph/:norte/:este/:sur/:oeste/:area', component: GraphComponent},
  {path: '**',redirectTo: 'home'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
