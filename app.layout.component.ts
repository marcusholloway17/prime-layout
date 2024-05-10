import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subject, map, takeUntil, tap } from "rxjs";
import { LayoutDataType } from "./types";
import { AuthService } from "../auth/services/auth.service";
import { AUTH_SERVICE } from "../auth/types";
import { LanguageService } from "src/app/helpers/language.service";
import { environment } from "src/environments/environment.development";
import { ThemeService } from "src/app/helpers/theme.service";

@Component({
  selector: "app-layout",
  templateUrl: "./app.layout.component.html",
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public userState$ = this.authService.userState$.pipe(
    takeUntil(this.destroy$)
  );
  public data!: LayoutDataType;
  public menuItems: MenuItem[] = [
    {
      label: this.languageService.instant("app.routing.customers"),
      routerLink: [`/${environment.app.routing.customers}`],
      icon: "pi pi-users",
    },
    {
      label: this.languageService.instant("app.routing.cards"),
      routerLink: [`/${environment.app.routing.cards}`],
      icon: "pi pi-credit-card",
    },
    {
      label: this.languageService.instant("app.routing.invoices"),
      routerLink: [`/${environment.app.routing.invoices}`],
      icon: "pi pi-ticket",
    },
    {
      label: this.languageService.instant("app.routing.rewards"),
      routerLink: [`/${environment.app.routing.rewards}`],
      icon: "pi pi-bolt",
    },
    {
      label: this.languageService.instant("app.routing.events"),
      routerLink: [`/${environment.app.routing.events}`],
      icon: "pi pi-images",
    },
    // {
    //   label: this.languageService.instant("app.routing.messages"),
    //   routerLink: [`/${environment.app.routing.messages}`],
    //   icon: "pi pi-megaphone",
    // },
    {
      label: this.languageService.instant("app.routing.configurations"),
      // routerLink: ["/configurations"],
      icon: "pi pi-cog",
      items: [
        {
          label: this.languageService.instant("app.routing.cardTypes"),
          routerLink: [`/${environment.app.routing.cardTypes}`],
          icon: "pi pi-cog",
        },
        {
          label: this.languageService.instant("app.routing.amountRewardGrids"),
          routerLink: [`/${environment.app.routing.amountRewardGrids}`],
          icon: "pi pi-cog",
        },
        {
          label: this.languageService.instant("app.routing.pointRewardGrids"),
          routerLink: [`/${environment.app.routing.pointRewardGrids}`],
          icon: "pi pi-cog",
        },
      ],
    },
  ];

  private authToken?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(AUTH_SERVICE) private authService: AuthService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    this.authService.signInState$
      .pipe(tap((state) => (this.authToken = state?.authToken)))
      .subscribe();
  }

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          return {
            ...data,
            menuItems: this.menuItems,
            popupMenuItems: [
              // {
              //   label: this.languageService.instant("auth.profile"),
              //   icon: "pi pi-fw pi-user",
              //   url: `${environment.auth.app}/#/auth/callback?authToken=${this.authToken}`,
              //   target: "_blank",
              // },
              // {
              //   label: this.languageService.instant(
              //     this.themeService.getTheme() == this.themeService.lightTheme
              //       ? "app.theme.themes.light"
              //       : "app.theme.themes.dark"
              //   ),
              //   icon:
              //     this.themeService.getTheme() == this.themeService.lightTheme
              //       ? "pi pi-fw pi-sun"
              //       : "pi pi-fw pi-moon",
              //   command: () => {
              //     this.themeService.switch(
              //       this.themeService.getTheme() == this.themeService.lightTheme
              //         ? this.themeService.darkTheme
              //         : this.themeService.lightTheme
              //     );
              //   },
              // },
              {
                label: this.languageService.instant("sign-out.label"),
                icon: "pi pi-fw pi-sign-out",
                command: () => {
                  this.router.navigate(["/auth/sign-out"]);
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
