import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit() {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const user = await this.authService.register({
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password,
        });

        this.router.navigate(['/shop']);
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  }

  async registerWithGoogle() {
    try {
      console.log('Google registration clicked');
      // Implement Google registration logic here
    } catch (error) {
      console.error('Google registration error:', error);
    }
  }

  async registerWithFacebook() {
    try {
      console.log('Facebook registration clicked');
      // Implement Facebook registration logic here
    } catch (error) {
      console.error('Facebook registration error:', error);
    }
  }
}
