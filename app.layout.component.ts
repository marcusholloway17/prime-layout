import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subject, interval, map, switchMap, takeUntil, tap } from 'rxjs';
import { LayoutDataType } from './types';
import { AuthService } from '../auth/services/auth.service';
import { AUTH_SERVICE } from '../auth/types';
import { LanguageService } from 'src/app/helpers/language.service';
import { AppointmentsService } from '../workspace/services/appointments.service';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public userState$ = this.authService.userState$.pipe(
    takeUntil(this.destroy$)
  );
  public data!: LayoutDataType;
  public menuItems: MenuItem[] = [
    {
      label: this.languageService.instant('app.routing.dashboard'),
      icon: 'pi pi-fw pi-home',
      routerLink: ['/'],
    },
    {
      id: 'appointments',
      label: this.languageService.instant('app.routing.appointments'),
      badge: '',
      badgeStyleClass: '',
      icon: 'pi pi-fw pi-calendar-times',
      routerLink: ['/appointments'],
    },
    {
      id: 'patients',
      label: this.languageService.instant('app.routing.patients'),
      icon: 'pi pi-fw pi-users',
      routerLink: ['/patients'],
      visible: this.authService.hasScopes(['poa:sys:all', 'poa:patient:list']),
    },
    {
      id: 'users',
      label: this.languageService.instant('app.routing.users'),
      icon: 'pi pi-fw pi-users',
      routerLink: ['/users'],
      visible: this.authService.hasScopes(['poa:sys:all', 'poa:user:list']),
    },
    {
      id: 'invoices',
      label: this.languageService.instant('app.routing.invoices'),
      badge: '',
      badgeStyleClass: '',
      icon: 'pi pi-fw pi-ticket',
      routerLink: ['/invoices'],
    },
    {
      id: 'configurations',
      label: this.languageService.instant('app.routing.configurations'),
      icon: 'pi pi-fw pi-cog',
      visible: this.authService.hasScopes([
        'poa:sys:all',
        'poa:service:list',
        'poa:payment-method:list',
        'poa:urgency-level:list',
        'poa:appointment-type:list',
        'poa:medical-staff-type:list',
      ]),
      items: [
        {
          label: this.languageService.instant('app.routing.services'),
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/configurations/services'],
          visible: this.authService.hasScopes([
            'poa:sys:all',
            'poa:service:list',
          ]),
        },
        {
          id: 'medical-staffs',
          label: this.languageService.instant('app.routing.medical-staffs'),
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/configurations/medical-staffs'],
          visible: this.authService.hasScopes([
            'poa:sys:all',
            'poa:medical-staff:list',
          ]),
        },
        {
          label: this.languageService.instant(
            'app.routing.medical-staff-types'
          ),
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/configurations/medical-staff-types'],
          visible: this.authService.hasScopes([
            'poa:sys:all',
            'poa:medical-staff-type:list',
          ]),
        },
        {
          label: this.languageService.instant('app.routing.appointment-types'),
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/configurations/appointment-types'],
          visible: this.authService.hasScopes([
            'poa:sys:all',
            'poa:appointment-type:list',
          ]),
        },
        {
          label: this.languageService.instant('app.routing.urgency-levels'),
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/configurations/urgency-levels'],
          visible: this.authService.hasScopes([
            'poa:sys:all',
            'poa:urgency-level:list',
          ]),
        },
        {
          label: this.languageService.instant('app.routing.payment-methods'),
          icon: 'pi pi-fw pi-folder',
          routerLink: ['/configurations/payment-methods'],
          visible: this.authService.hasScopes([
            'poa:sys:all',
            'poa:payment-method:list',
          ]),
        },
      ],
    },
  ];

  public statisticRequestCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTH_SERVICE) private authService: AuthService,
    private languageService: LanguageService,
    private appointmentService: AppointmentsService
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          return {
            ...data,
            menuItems: this.menuItems,
            popupMenuItems: [
              {
                label: this.languageService.instant('sign-out.label'),
                icon: 'pi pi-fw pi-sign-out',
                command: () => {
                  this.router.navigate(['/auth/sign-out']);
                },
              },
            ],
          };
        }),
        tap((data) => {
          this.data = data as LayoutDataType;
        })
      )
      .subscribe();

    this.handleStatisticState();
  }

  handleStatisticState() {
    if (this.authService.hasScopes(['poa:sys:all', 'poa:appointment:list'])) {
      this.appointmentService
        .getPendingAppoinments()
        .pipe(
          takeUntil(this.destroy$),
          tap((state) => {
            this.statisticRequestCount += 1;
            this.setAppointmentMenuState(
              state?.total,
              'p-badge p-badge-warning'
            );
          }),
          switchMap(() =>
            interval(1000 * 60).pipe(
              takeUntil(this.destroy$),
              switchMap(() =>
                this.appointmentService.getPendingAppoinments().pipe(
                  tap((state) => {
                    this.statisticRequestCount += 1;
                    this.setAppointmentMenuState(
                      state?.total,
                      'p-badge p-badge-warning'
                    );
                  })
                )
              )
            )
          )
        )
        .subscribe();
    } else {
      this.appointmentService
        .getConfirmedAppoinments()
        .pipe(
          takeUntil(this.destroy$),
          tap((state) => {
            this.statisticRequestCount += 1;
            this.setAppointmentMenuState(
              state?.total,
              'p-badge p-badge-success'
            );
          }),
          switchMap(() =>
            interval(1000 * 60).pipe(
              takeUntil(this.destroy$),
              switchMap(() =>
                this.appointmentService.getConfirmedAppoinments().pipe(
                  tap((state) => {
                    this.statisticRequestCount += 1;
                    this.setAppointmentMenuState(
                      state?.total,
                      'p-badge p-badge-success'
                    );
                  })
                )
              )
            )
          )
        )
        .subscribe();
    }
  }

  setAppointmentMenuState(total: number, badgeStyleClass: string) {
    this.menuItems = this.menuItems.map((menu) => {
      if (menu.id == 'appointments') {
        menu.badge = total == 0 ? '' : String(total);
        menu.badgeStyleClass = badgeStyleClass;
      }
      return menu;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
