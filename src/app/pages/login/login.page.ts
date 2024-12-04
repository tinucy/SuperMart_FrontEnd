import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CredentialsService } from "../../services/credentials.service";
import { UserRole } from "../../interfaces/user.interface";
import {
  AlertController,
  LoadingController,
  ToastController,
} from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private credentialsService: CredentialsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    // Load saved credentials if they exist
    const savedCredentials = this.credentialsService.getSavedCredentials();
    if (savedCredentials) {
      this.loginForm.patchValue({
        email: savedCredentials.email,
        password: savedCredentials.password,
        rememberMe: true,
      });
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password, rememberMe } = this.loginForm.value;

        // Save or clear credentials based on remember me checkbox
        if (rememberMe) {
          this.credentialsService.saveCredentials({ email, password });
        } else {
          this.credentialsService.clearSavedCredentials();
        }

        const user = await this.authService.login(email, password);

        // Navigate based on user role
        switch (user.role) {
          case UserRole.ADMIN:
            this.router.navigate(["/admin/dashboard"]);
            break;
          case UserRole.STAFF:
            this.router.navigate(["/staff/dashboard"]);
            break;
          case UserRole.CUSTOMER:
          default:
            this.router.navigate(["/shop"]);
            break;
        }
      } catch (error) {
        console.error("Login error:", error);
        // Handle login error (show message to user)
      }
    }
  }

  async loginWithGoogle() {
    try {
      console.log("Google login clicked");
      // Implement Google login logic here
    } catch (error) {
      console.error("Google login error:", error);
    }
  }

  async loginWithFacebook() {
    try {
      console.log("Facebook login clicked");
      // Implement Facebook login logic here
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: "Reset Password",
      message: "Enter your email address to receive a password reset link.",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Enter your email",
          value: this.loginForm.get("email")?.value || "",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reset Password",
          handler: async (data) => {
            if (!data.email) {
              return false;
            }
            await this.sendPasswordResetEmail(data.email);
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  private async sendPasswordResetEmail(email: string) {
    const loading = await this.loadingController.create({
      message: "Sending reset link...",
    });
    await loading.present();

    try {
      // In a real app, you would call your auth service here
      // await this.authService.sendPasswordResetEmail(email);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const toast = await this.toastController.create({
        message: "Password reset link sent to your email",
        duration: 3000,
        color: "success",
        position: "bottom",
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: "Failed to send reset link. Please try again.",
        duration: 3000,
        color: "danger",
        position: "bottom",
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }
}
