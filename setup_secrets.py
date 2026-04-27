#!/usr/bin/env python3
"""
Set up GitHub Actions secrets for mentivis-web deployment.
Usage: python3 setup_secrets.py <VERCEL_TOKEN>
"""
import sys
import base64
import urllib.request
import json
from nacl.public import PublicKey, SealedBox

REPO = "stevedelcourt/mentivis-web"
GH_API = f"https://api.github.com/repos/{REPO}/actions/secrets"

def gh_headers():
    token = sys.stdout = sys.stderr = None
    import subprocess
    token = subprocess.check_output(["gh", "auth", "token"], text=True).strip()
    return {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
    }

def get_public_key():
    url = f"{GH_API}/public-key"
    req = urllib.request.Request(url, headers=gh_headers())
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    return data["key_id"], data["key"]

def encrypt_secret(plaintext, public_key_b64):
    pub_key_bytes = base64.b64decode(public_key_b64)
    pub_key = PublicKey(pub_key_bytes)
    box = SealedBox(pub_key)
    encrypted = box.encrypt(plaintext.encode())
    return base64.b64encode(encrypted).decode()

def set_secret(name, value, key_id, public_key):
    encrypted = encrypt_secret(value, public_key)
    url = f"{GH_API}/{name}/secrets"
    payload = {"encrypted_value": encrypted, "key_id": key_id}
    data = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, headers=gh_headers(), method="PUT")
    with urllib.request.urlopen(req) as r:
        if r.status == 204:
            print(f"  ✓ {name}")
        else:
            print(f"  ✗ {name}: {r.read()}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 setup_secrets.py <VERCEL_TOKEN>")
        print("\nSecrets needed:")
        print("  VERCEL_TOKEN        - Your Vercel API token (from vercel.com/account/tokens)")
        print("  VERCEL_ORG_ID       - team_A4Li1aXHDfOBE1mujazC835Y")
        print("  VERCEL_PROJECT_ID   - mentivis-web")
        print("  FTP_HOST            - sc4bovu7233.universe.wf")
        print("  FTP_USER            - sc4bovu7233")
        print("  FTP_PASSWORD        - RoxanStevenMathias2024")
        sys.exit(1)

    vercel_token = sys.argv[1]

    print("Fetching repo public key...")
    key_id, public_key = get_public_key()
    print(f"  Got key_id: {key_id}")

    secrets = {
        "VERCEL_TOKEN": vercel_token,
        "VERCEL_ORG_ID": "team_A4Li1aXHDfOBE1mujazC835Y",
        "VERCEL_PROJECT_ID": "mentivis-web",
        "FTP_HOST": "sc4bovu7233.universe.wf",
        "FTP_USER": "sc4bovu7233",
        "FTP_PASSWORD": "RoxanStevenMathias2024",
    }

    print("Setting secrets...")
    for name, value in secrets.items():
        set_secret(name, value, key_id, public_key)

    print("\nAll secrets set! You can now push to trigger deployments.")

if __name__ == "__main__":
    main()
