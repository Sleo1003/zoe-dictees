#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# setup-piper.sh — Installe Piper TTS et génère les fichiers audio pour zoe-dictees
# Auteur : projet zoe-dictees
# Usage  : chmod +x setup-piper.sh && ./setup-piper.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

PROJECT_DIR="/home/sleo/zoe-dictees"
AUDIO_DIR="$PROJECT_DIR/public/audio"
PIPER_DIR="$HOME/piper"
MODELS_DIR="$HOME/piper-models"
PIPER_VERSION="2023.11.14-2"

# ── Détection architecture Raspberry Pi ──────────────────────────────────────
ARCH=$(uname -m)
if [[ "$ARCH" == "aarch64" ]]; then
    PIPER_TAR="piper_linux_aarch64.tar.gz"
elif [[ "$ARCH" == "armv7l" ]]; then
    PIPER_TAR="piper_linux_armv7l.tar.gz"
else
    echo "❌ Architecture non supportée : $ARCH"
    exit 1
fi

echo "═══════════════════════════════════════"
echo "  🎙️  Installation Piper TTS — zoe-dictees"
echo "  Architecture : $ARCH"
echo "═══════════════════════════════════════"

# ── Création des dossiers ─────────────────────────────────────────────────────
mkdir -p "$PIPER_DIR" "$MODELS_DIR"
mkdir -p "$AUDIO_DIR/fr" "$AUDIO_DIR/en"

# ── Téléchargement Piper ──────────────────────────────────────────────────────
if [ ! -f "$PIPER_DIR/piper" ]; then
    echo ""
    echo "📥 Téléchargement Piper ($PIPER_VERSION)..."
    PIPER_URL="https://github.com/rhasspy/piper/releases/download/$PIPER_VERSION/$PIPER_TAR"
    wget -q --show-progress -O "$PIPER_DIR/piper.tar.gz" "$PIPER_URL"
    tar -xzf "$PIPER_DIR/piper.tar.gz" -C "$PIPER_DIR" --strip-components=1
    rm "$PIPER_DIR/piper.tar.gz"
    echo "✅ Piper installé"
else
    echo "✅ Piper déjà installé"
fi

PIPER_BIN="$PIPER_DIR/piper"
BASE_URL="https://huggingface.co/rhasspy/piper-voices/resolve/main"

# ── Téléchargement modèle Français ───────────────────────────────────────────
if [ ! -f "$MODELS_DIR/fr.onnx" ]; then
    echo ""
    echo "📥 Téléchargement voix française (fr_FR-upmc-medium)..."
    FR_PATH="fr/fr_FR/upmc/medium/fr_FR-upmc-medium"
    wget -q --show-progress -O "$MODELS_DIR/fr.onnx"      "$BASE_URL/$FR_PATH.onnx"
    wget -q --show-progress -O "$MODELS_DIR/fr.onnx.json" "$BASE_URL/$FR_PATH.onnx.json"
    echo "✅ Voix française OK"
else
    echo "✅ Voix française déjà téléchargée"
fi

# ── Téléchargement modèle Anglais ────────────────────────────────────────────
if [ ! -f "$MODELS_DIR/en.onnx" ]; then
    echo ""
    echo "📥 Téléchargement voix anglaise (en_US-lessac-medium)..."
    EN_PATH="en/en_US/lessac/medium/en_US-lessac-medium"
    wget -q --show-progress -O "$MODELS_DIR/en.onnx"      "$BASE_URL/$EN_PATH.onnx"
    wget -q --show-progress -O "$MODELS_DIR/en.onnx.json" "$BASE_URL/$EN_PATH.onnx.json"
    echo "✅ Voix anglaise OK"
else
    echo "✅ Voix anglaise déjà téléchargée"
fi

# ── Fonction de génération ────────────────────────────────────────────────────
gen() {
    local text="$1"
    local lang="$2"          # fr | en
    local filename="$3"
    local model="$MODELS_DIR/$lang.onnx"
    local outfile="$AUDIO_DIR/$lang/$filename.wav"

    if [ ! -f "$outfile" ]; then
        echo "$text" | "$PIPER_BIN" \
            --model "$model" \
            --length_scale 1.2 \
            --output_file "$outfile" 2>/dev/null
        echo "  ✅ $lang/$filename.wav"
    fi
}

echo ""
echo "🎙️  Génération des fichiers audio..."
echo ""
echo "── Mots français ────────────────────"

# Mots — phonétique FR
gen "chat"     fr chat
gen "chien"    fr chien
gen "vache"    fr vache
gen "chose"    fr chose
gen "loup"     fr loup
gen "mouton"   fr mouton
gen "jouer"    fr jouer
gen "roux"     fr roux
gen "dent"     fr dent
gen "enfant"   fr enfant
gen "blanc"    fr blanc
gen "temps"    fr temps
gen "bon"      fr bon
gen "maison"   fr maison
gen "ballon"   fr ballon
gen "citron"   fr citron
gen "girafe"   fr girafe
gen "géant"    fr geant
gen "manger"   fr manger
gen "rouge"    fr rouge
gen "ombre"    fr ombre
gen "nombre"   fr nombre
gen "tomber"   fr tomber
gen "bouton"   fr bouton
gen "saison"   fr saison

# Phonèmes isolés FR (lecture lente)
gen "ch"  fr ph_ch
gen "ou"  fr ph_ou
gen "an"  fr ph_an
gen "on"  fr ph_on
gen "nom" fr ph_om

# Mots — dictées FR (à compléter selon content.ts)
gen "grenouille" fr grenouille
gen "papillon"   fr papillon
gen "soleil"     fr soleil
gen "nuage"      fr nuage
gen "forêt"      fr foret
gen "rivière"    fr riviere
gen "montagne"   fr montagne

echo ""
echo "── Mots anglais ─────────────────────"

gen "chair"   en chair
gen "chain"   en chain
gen "beach"   en beach
gen "cloud"   en cloud
gen "mouse"   en mouse
gen "sound"   en sound
gen "hand"    en hand
gen "band"    en band
gen "land"    en land
gen "bone"    en bone
gen "moon"    en moon
gen "spoon"   en spoon
gen "button"  en button
gen "giraffe" en giraffe
gen "giant"   en giant
gen "gem"     en gem
gen "bridge"  en bridge
gen "melon"   en melon
gen "lemon"   en lemon
gen "cotton"  en cotton
gen "mom"     en mom
gen "bomb"    en bomb
gen "bottom"  en bottom

# Phonèmes isolés EN
gen "ch"  en ph_ch_en
gen "ow"  en ph_ow_en

echo ""
echo "═══════════════════════════════════════"
echo "  ✅ Génération terminée !"
echo "  📁 Fichiers dans : $AUDIO_DIR"
echo ""
echo "  👉 Étapes suivantes :"
echo "     cd $PROJECT_DIR"
echo "     git add public/audio"
echo "     git commit -m 'audio: voix Piper TTS naturelles'"
echo "     git push"
echo "═══════════════════════════════════════"
