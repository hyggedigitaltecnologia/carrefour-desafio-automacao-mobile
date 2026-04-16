"""
Gera um summary em Markdown para o GitHub Actions a partir do JUnit XML.
Adaptado para testes mobile com WebDriverIO + Appium.
Uso: python generate_summary.py <junit_xml_path> <titulo>
"""

import sys
import xml.etree.ElementTree as ET
from collections import defaultdict


def parse_junit(xml_path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    suites = root.findall(".//testsuite")
    if not suites:
        suites = [root] if root.tag == "testsuite" else []

    tests = []
    for suite in suites:
        for tc in suite.findall("testcase"):
            classname = tc.get("classname", "")
            name = tc.get("name", "")
            time_s = float(tc.get("time", "0"))

            failure = tc.find("failure")
            error = tc.find("error")
            skipped = tc.find("skipped")

            if failure is not None:
                status = "failed"
                message = failure.get("message", "")
            elif error is not None:
                status = "error"
                message = error.get("message", "")
            elif skipped is not None:
                status = "skipped"
                message = skipped.get("message", "")
            else:
                status = "passed"
                message = ""

            tests.append({
                "classname": classname,
                "name": name,
                "time": time_s,
                "status": status,
                "message": message,
            })

    return tests


def get_screen_from_class(classname):
    """Mapeia o classname do teste para a tela/funcionalidade do app."""
    mapping = {
        "Login - Autenticação do usuário": "Login",
        "Cadastro - Registro de novo usuário": "Cadastro",
        "Navegação - Tab Bar entre telas": "Navegação",
        "Formulários - Preenchimento e interações": "Formulários",
        "Swipe - Carrossel e scroll": "Swipe",
        "Drag and Drop - Puzzle de arrastar": "Drag & Drop",
        "WebView - Contexto web dentro do app": "WebView",
        "E2E - Jornada completa do usuário": "E2E",
    }

    for key, value in mapping.items():
        if key in classname:
            return value

    # Fallback: extrai a parte antes do ponto ou usa o classname completo
    cls = classname.rsplit(".", 1)[-1] if "." in classname else classname
    return cls


def status_icon(status):
    return {
        "passed": "\u2705",
        "failed": "\u274c",
        "error": "\U0001f4a5",
        "skipped": "\u23ed\ufe0f",
    }.get(status, "\u2753")


def generate_markdown(tests, title):
    total = len(tests)
    passed = sum(1 for t in tests if t["status"] == "passed")
    failed = sum(1 for t in tests if t["status"] == "failed")
    errors = sum(1 for t in tests if t["status"] == "error")
    skipped = sum(1 for t in tests if t["status"] == "skipped")
    total_time = sum(t["time"] for t in tests)
    pass_rate = (passed / total * 100) if total > 0 else 0

    lines = []

    # Header
    lines.append(f"# \U0001f4f1 {title}\n")

    # Summary
    if failed == 0 and errors == 0:
        lines.append("> \u2705 **Todos os testes passaram com sucesso!**\n")
    else:
        lines.append(f"> \u274c **{failed + errors} teste(s) falharam**\n")

    lines.append("| Metrica | Valor |")
    lines.append("|---|---|")
    lines.append(f"| \U0001f4ca Total de testes | **{total}** |")
    lines.append(f"| \u2705 Passou | **{passed}** |")
    lines.append(f"| \u274c Falhou | **{failed}** |")
    lines.append(f"| \U0001f4a5 Erro | **{errors}** |")
    lines.append(f"| \u23ed\ufe0f Ignorado | **{skipped}** |")
    lines.append(f"| \u23f1\ufe0f Tempo total | **{total_time:.1f}s** |")
    lines.append(f"| \U0001f3af Taxa de sucesso | **{pass_rate:.1f}%** |")
    lines.append("")

    # Progress bar
    bar_len = 30
    filled = int(bar_len * pass_rate / 100)
    bar = "\U0001f7e9" * filled + "\U0001f7e5" * (bar_len - filled)
    lines.append(f"### Taxa de Sucesso: {pass_rate:.1f}%")
    lines.append(f"`{bar}` {passed}/{total}\n")

    # Results by screen/feature
    by_screen = defaultdict(list)
    for t in tests:
        screen = get_screen_from_class(t["classname"])
        by_screen[screen].append(t)

    lines.append("## \U0001f4cb Resultado por Tela/Funcionalidade\n")
    lines.append("| Tela | Testes | Passou | Falhou | Ignorado | Tempo |")
    lines.append("|---|---|---|---|---|---|")

    for screen in sorted(by_screen.keys()):
        screen_tests = by_screen[screen]
        s_total = len(screen_tests)
        s_passed = sum(1 for t in screen_tests if t["status"] == "passed")
        s_failed = sum(1 for t in screen_tests if t["status"] in ("failed", "error"))
        s_skipped = sum(1 for t in screen_tests if t["status"] == "skipped")
        s_time = sum(t["time"] for t in screen_tests)
        icon = "\u2705" if s_failed == 0 else "\u274c"
        lines.append(
            f"| {icon} **{screen}** | {s_total} | {s_passed} | {s_failed} | {s_skipped} | {s_time:.1f}s |"
        )

    lines.append("")

    # Detailed test list
    lines.append("<details>")
    lines.append("<summary><strong>\U0001f50d Detalhamento de todos os testes</strong></summary>\n")
    lines.append("| Status | Teste | Tempo |")
    lines.append("|---|---|---|")

    for t in sorted(
        tests, key=lambda x: (x["status"] != "failed", x["classname"], x["name"])
    ):
        icon = status_icon(t["status"])
        screen = get_screen_from_class(t["classname"])
        test_name = t["name"].replace("[", "\\[").replace("]", "\\]")
        lines.append(f"| {icon} | **{screen}** > {test_name} | {t['time']:.2f}s |")

    lines.append("\n</details>\n")

    # Failures detail
    failures = [t for t in tests if t["status"] in ("failed", "error")]
    if failures:
        lines.append("## \u274c Detalhes das Falhas\n")
        for t in failures:
            lines.append(f"### `{t['name']}`")
            screen = get_screen_from_class(t["classname"])
            lines.append(f"**Tela:** `{screen}`\n")
            lines.append("```")
            lines.append(t["message"][:500])
            lines.append("```\n")

    # Top 5 slowest
    slowest = sorted(tests, key=lambda x: x["time"], reverse=True)[:5]
    lines.append("## \U0001f422 Top 5 Testes Mais Lentos\n")
    lines.append("| Teste | Tela | Tempo |")
    lines.append("|---|---|---|")
    for t in slowest:
        screen = get_screen_from_class(t["classname"])
        lines.append(f"| `{t['name'][:60]}` | {screen} | {t['time']:.2f}s |")

    lines.append("")

    # Environment info
    lines.append("## \u2699\ufe0f Ambiente de Teste\n")
    lines.append("| Item | Valor |")
    lines.append("|---|---|")
    lines.append("| **Plataforma** | Android |")
    lines.append("| **Framework** | WebDriverIO v9 |")
    lines.append("| **Driver** | Appium UiAutomator2 |")
    lines.append("| **App** | native-demo-app v2.2.0 |")
    lines.append("| **Assertions** | Chai |")
    lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

    xml_path = sys.argv[1]
    title = sys.argv[2] if len(sys.argv) > 2 else "Mobile Test Report"

    tests = parse_junit(xml_path)
    print(generate_markdown(tests, title))
