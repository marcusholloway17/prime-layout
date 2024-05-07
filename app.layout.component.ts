import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "primeng/api";
import { Subject, takeUntil } from "rxjs";
import { LayoutDataType } from "./types";
import { AuthService } from "../auth/services/auth.service";
import { AUTH_SERVICE } from "../auth/types";

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
  @Input() public routes: MenuItem[] = [];

  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
