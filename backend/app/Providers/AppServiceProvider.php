<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Validation\Rules\Password;
use App\Consts\AuthConsts;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Password::defaults(function () {
            return Password::min(AuthConsts::PASSWORD_LENGTH_MIN)->letters()
                                ->mixedCase()
                                ->numbers()
                                ->symbols()
                                ->uncompromised();;
        });
    }
}
