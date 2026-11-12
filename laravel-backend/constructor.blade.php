{{--
  Страница конструктора. Положить в resources/views/constructor.blade.php
  Файлы сборки (frontend/dist/constructor.js и constructor.css) — в public/constructor/
--}}
@extends('layouts.app')

@section('content')
    @php($v = filemtime(public_path('constructor/constructor.js')))

    <link rel="stylesheet" href="{{ asset('constructor/constructor.css') }}?v={{ $v }}">

    <div id="subtelne-constructor"
         data-materials-url="{{ route('constructor.materials') }}"
         data-cart-url="{{ route('constructor.cart.add') }}"
         data-cart-page-url="{{ url('/cart') }}"
         data-csrf-token="{{ csrf_token() }}">
    </div>

    <script type="module" src="{{ asset('constructor/constructor.js') }}?v={{ $v }}"></script>
@endsection
