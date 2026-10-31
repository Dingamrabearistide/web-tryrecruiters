import { Component } from "@angular/core";

@Component({
  selector: "app-server-error",
  standalone: false,
  template: `
    <div
      class="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10 text-center"
    >
      <h1 class="text-[120px] font-extrabold text-[#1D9BED] leading-none">
        500
      </h1>
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        Server Error
      </h2>
      <p class="text-gray-600 mb-8 text-sm md:text-base max-w-md">
        We're sorry, something went wrong on our end. Please try later.
      </p>
      <a
        href="/"
        class="inline-block px-6 py-3 bg-[#1D9BED] text-white text-sm font-medium rounded hover:bg-blue-600 transition"
      >
        Go to Homepage
      </a>
    </div>
  `,
})
export class ServerErrorComponent {}
