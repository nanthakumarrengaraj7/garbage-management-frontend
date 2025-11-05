import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './Pages/about-us/about-us.component';
import { WardsComponent } from './Pages/wards/wards.component';
import { ComplaintsComponent } from './Pages/complaints/complaints.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';

import { AdminloginComponent } from './admin/adminlogin/adminlogin.component';
import { DashBoardComponent } from './admin/dash-board/dash-board.component';
import { AdminWardsComponent } from './admin/admin-wards/admin-wards.component';
import { AdminComplaintsComponent } from './admin/admin-complaints/admin-complaints.component';
import { EmployeeComponent } from './admin/employee/employee.component';
import { UsersComponent } from './admin/users/users.component';
import { AdminContactComponent } from './admin/admin-contact/admin-contact.component';
import { AdminReportsComponent } from './admin/admin-reports/admin-reports.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default Route
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'wards', component: WardsComponent },
  { path: 'complaints', component: ComplaintsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminloginComponent },
  {path:'admindashboard' , component:DashBoardComponent},
  {path:'adminwards' , component:AdminWardsComponent},
  {path:'admincomplaints' , component:AdminComplaintsComponent},
  {path:'adminemployee' , component:EmployeeComponent},
  {path:'adminUsers' , component:UsersComponent},
  {path:'adminContact' , component:AdminContactComponent},
  {path:'adminReport' , component:AdminReportsComponent},









 
];
