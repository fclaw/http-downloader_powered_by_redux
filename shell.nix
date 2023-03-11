{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-22.11.tar.gz") {}
, nodejs ? pkgs."nodejs-18_x"
 }:
let
  easy-ps = import
    (pkgs.fetchFromGitHub {
      owner = "justinwoo";
      repo = "easy-purescript-nix";
      rev = "11d3bd58ce6e32703bf69cec04dc7c38eabe14ba";
      sha256 = "sha256-tESal32bcqqdZO+aKnBzc1GoL2mtnaDtj2y7ociCRGA=";
    }) { inherit pkgs; };
  new_spago = pkgs.spago.overrideAttrs (old: {
        name = "spago";
        src = pkgs.fetchgit {
          url = "https://github.com/purescript/spago.git";
          rev = "d16d4914200783fbd820ba89dbdf67270454faf5";
          sha256 = "sha256-MMKt5BWpdvKxGlLB/5TkFEKXODUIHQL5T21wtc/DbQM=";
        }; });
in
  pkgs.mkShell {
    buildInputs = [
      nodejs
    /*  new_spago
      easy-ps.purs-0_15_7
      easy-ps.psc-package
      easy-ps.purescript-language-server
      easy-ps.purs-backend-es */ ];
      shellHook = ''
        npm install typescript
        export PATH="node_modules/typescript/bin:$PATH"
        echo 'Welcome! You have entered into the nix-shell for `frontend.`'
      '';
      }