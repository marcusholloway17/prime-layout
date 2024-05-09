import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Subject, takeUntil, tap } from "rxjs";
import { LayoutDataType } from "./types";
import { AuthService } from "../auth/services/auth.service";
import { AUTH_SERVICE } from "../auth/types";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-layout",
  templateUrl: "./app.layout.component.html",
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public userState$ = this.authService.userState$.pipe(
    takeUntil(this.destroy$)
  );
  @Input() public data!: any;
  @Input() public routes: MenuItem[] = [];
  @Input() public title!: string;
  @Input() public description!: string;

  constructor(
    @Inject(AUTH_SERVICE) private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.route.data.pipe(tap((state) => (this.data = state))).subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
