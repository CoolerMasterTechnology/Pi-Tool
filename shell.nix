let
  moz_overlay = import (builtins.fetchTarball https://github.com/mozilla/nixpkgs-mozilla/archive/master.tar.gz);
  nixpkgs = import <nixpkgs> { overlays = [ moz_overlay ]; };
in
  with nixpkgs;
  stdenv.mkDerivation {
    name = "dev-shell";
    buildInputs = [
      nixpkgs.latest.rustChannels.stable.rust
      nodejs-12_x
      pkgconfig
      openssl
      yarn
    ];
  }


# stdenv.mkDerivation {
#   name = "development-shell";
#   buildInputs = with pkgs; [
#     yarn
#     openssl
#     pkgconfig
#   ];
# }
