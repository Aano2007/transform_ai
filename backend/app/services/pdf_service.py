import os
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)

def create_executive_pdf(title: str, summary_markdown: str, ico_data: Dict[str, Any], output_path: str) -> str:
    """
    Builds a high-impact, professional executive PDF deliverable using ReportLab.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=48,
        rightMargin=48,
        topMargin=48,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#FF6B00")  # iQOO brand accent
    dark_slate = colors.HexColor("#0F172A")
    muted_text = colors.HexColor("#64748B")
    border_color = colors.HexColor("#E2E8F0")
    row_alt_bg = colors.HexColor("#F8FAFC")

    brand_style = ParagraphStyle(
        "BrandHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=primary_color,
        textTransform="uppercase",
        spaceAfter=4,
    )

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=dark_slate,
        spaceAfter=8,
    )

    meta_style = ParagraphStyle(
        "MetaText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=muted_text,
        spaceAfter=12,
    )

    h2_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=dark_slate,
        spaceBefore=12,
        spaceAfter=6,
    )

    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        "BulletPoint",
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4,
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
    )

    table_hdr_style = ParagraphStyle(
        "TableHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.white,
    )

    story = []

    # 1. Header Banner
    story.append(Paragraph("TRANSFORMAI // EXECUTIVE DELIVERABLE BRIEF", brand_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=2, spaceAfter=8))

    # 2. Main Title
    clean_title = title.replace("#", "").strip() if title else "Executive Briefing"
    story.append(Paragraph(clean_title, title_style))

    # 3. Metadata Bar
    timestamp = ico_data.get("timestamp", "Present")
    loc = ico_data.get("location", "TransformAI Edge Engine")
    obj = ico_data.get("primary_objective", "Operational alignment & execution")
    meta_content = f"<b>Generated:</b> {timestamp} &nbsp;|&nbsp; <b>Location:</b> {loc} &nbsp;|&nbsp; <b>Core Objective:</b> {obj}"
    story.append(Paragraph(meta_content, meta_style))
    story.append(Spacer(1, 6))

    # 4. Strategic Overview
    overview_text = ico_data.get("executive_overview", "")
    if overview_text:
        story.append(Paragraph("1. Strategic Overview", h2_style))
        story.append(Paragraph(overview_text, body_style))
        story.append(Spacer(1, 4))

    # 5. Key Findings & Observations
    findings = ico_data.get("key_findings", [])
    if findings:
        story.append(Paragraph("2. Key Findings & Insights", h2_style))
        for f in findings:
            bullet_text = f"&bull;&nbsp;&nbsp;{f}"
            story.append(Paragraph(bullet_text, bullet_style))
        story.append(Spacer(1, 4))

    # 6. Action Matrix Table
    actions = ico_data.get("action_items", [])
    if actions:
        story.append(Paragraph("3. Action Matrix & Ownership", h2_style))
        table_data = [
            [
                Paragraph("Owner", table_hdr_style),
                Paragraph("Action Item / Milestone", table_hdr_style),
                Paragraph("Deadline", table_hdr_style),
            ]
        ]
        for item in actions:
            owner = item.get("owner", "Team")
            task = item.get("task", "")
            deadline = item.get("deadline", "TBD")
            table_data.append([
                Paragraph(f"<b>{owner}</b>", table_cell_style),
                Paragraph(task, table_cell_style),
                Paragraph(deadline, table_cell_style),
            ])

        col_widths = [110, 316, 90]  # Total = 516 pt (standard printable width)
        matrix_table = Table(table_data, colWidths=col_widths)
        
        t_style = [
            ("BACKGROUND", (0, 0), (-1, 0), dark_slate),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("GRID", (0, 0), (-1, -1), 0.5, border_color),
        ]
        for row_idx in range(1, len(table_data)):
            if row_idx % 2 == 0:
                t_style.append(("BACKGROUND", (0, row_idx), (-1, row_idx), row_alt_bg))

        matrix_table.setStyle(TableStyle(t_style))
        story.append(matrix_table)
        story.append(Spacer(1, 8))

    # 7. Metrics & Milestones
    metrics = ico_data.get("entities", {}).get("metrics", [])
    if metrics:
        story.append(Paragraph("4. Key Milestones & Metrics", h2_style))
        for m in metrics:
            story.append(Paragraph(f"&bull;&nbsp;&nbsp;<b>Target:</b> {m}", bullet_style))
        story.append(Spacer(1, 6))

    # 8. Footer divider
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceBefore=4, spaceAfter=6))
    footer_text = "Verified Intent Context Object (ICO) &bull; Zero Hallucination Pipeline &bull; TransformAI Headless Engine"
    story.append(Paragraph(footer_text, ParagraphStyle("Footer", parent=meta_style, fontSize=7.5, alignment=1)))

    doc.build(story)
    return output_path
