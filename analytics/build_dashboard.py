import datetime as dt
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.formatting.rule import CellIsRule
from openpyxl.utils import get_column_letter as L

hdr=["WAVE","DELIVERY PROBILL","BILLING PROBILL","Shipping Date","Delivery date","Must Delivered by -14 DAYS","Must Delivered by -7 DAYS","total days to deliver","Dealer code","Dealer name","City","Province","Postal Code","Dimension (in)","Weight (lbs)","CLASSIFICATION","DEST BR","ALLOCATION FILE","PU TERM","PU CARRIER","DEL TERM","DEL CARRIER","ZONE","CHK DEST SP","ORIG PROV CHK"]
raw="""W22	3007226467	3007226467	2025-10-02	2025-10-08	2025-10-16	2025-10-09	6	AB00410	RCM AUTO LTD.	ST. ALBERT	AB	T8N 0P7	163 x 94 x 51	3147	UZ-TV	ED	OLD	CA	FASTFRATE	ED	FASTFRATE	INTRA WEST	ST ALBERT	AB
W22	3007226330	3007226330	2025-10-01	2025-10-15	2025-10-15	2025-10-08	14	AB00700	LETHAL RACING LTD.	Lloydminster	AB	T9V 3C4	163 x 94 x 51	3147	UZ-TV	ED	OLD	CA	FASTFRATE	ED	HIWAY9	INTRA WEST	LLOYDMINSTER	AB
W22	3007226304	3007364421	2025-10-06	2025-10-08	2025-10-20	2025-10-13	2	BC00380	1497115 B.C. LTD.	Squamish	BC	V8B 1C9	121 x 93 x 52	4453	UZ-TV	VA	OLD	CA	FASTFRATE	VA	COMOX	INTRA WEST	SQUAMISH	AB
W22	3007364356	3007364469	2025-10-14	2025-10-16	2025-10-28	2025-10-21	2	SK00160	PRAIRIE RECREATION PARTS & ACCESSORIES	Prince Albert	SK	S6V 5P9	120 x 67 x 52	2978	UZ-TV	SK	OLD	CA	FASTFRATE	SK	CFSL	INTRA WEST	PRINCE ALBERT	AB
W24	3007362186	3007362186	2025-10-02	2025-10-15	2025-10-16	2025-10-09	13	AB00670	BASECAMP MOTORSPORTS INC.	CALGARY	AB	T2H 2B7	93 x 54 x 50	1237	C-ATV	CA	OLD	CA	FASTFRATE	CA	FASTFRATE	INTRA WEST	CALGARY	AB
W24	3007362061	3007363645	2025-10-01	2025-10-03	2025-10-15	2025-10-08	2	SK00160	PRAIRIE RECREATION PARTS & ACCESSORIES	Prince Albert	SK	S6V 5P9	94 x 50 x 34	776	C-ATV	SK	OLD	CA	FASTFRATE	SK	CFSL	INTRA WEST	PRINCE ALBERT	AB
W24	3007362059	3007363645	2025-10-01	2025-10-03	2025-10-15	2025-10-08	2	SK00160	PRAIRIE RECREATION PARTS & ACCESSORIES	Prince Albert	SK	S6V 5P9	94 x 50 x 34	776	C-ATV	SK	OLD	CA	FASTFRATE	SK	CFSL	INTRA WEST	PRINCE ALBERT	AB
W24	3007363722	3007363594	2025-10-01	2025-10-06	2025-10-15	2025-10-08	5	SK00160	PRAIRIE RECREATION PARTS & ACCESSORIES	Prince Albert	SK	S6V 5P9	163 x 94 x 51	3147	UZ-TV	SK	OLD	CA	FASTFRATE	SK	CFSL	INTRA WEST	PRINCE ALBERT	AB"""
rows=[]
for line in raw.splitlines():
    v=line.split("\t")
    for i in (3,4,5,6): v[i]=dt.datetime.strptime(v[i],"%Y-%m-%d")
    for i in (7,14): v[i]=int(v[i])
    rows.append(v)

F=lambda **k: Font(name="Arial",**k)
NAVY="1F3864"; HF=PatternFill("solid",fgColor=NAVY); CALC=PatternFill("solid",fgColor="E2EFDA")
thin=Side(style="thin",color="BFBFBF"); BD=Border(left=thin,right=thin,top=thin,bottom=thin)
N=2000  # formula rows prepared
wb=Workbook()

# ---------- Data ----------
d=wb.active; d.title="Data"
calc=["Transit Days","OTP 7 (1=On Time)","OTP 14 (1=On Time)","Days Late vs 7","Days Late vs 14","Ship Week (Mon)","Late Seq (7-day)","Unique Delivery Pro (1=count)","Ship Day","Delivery Day","Ship Month","Weight Band","Lane (PU>DEL Term)","Transit Bucket","Province Flow","Billing Type","Unique Billing Pro"]
allh=hdr+calc
for c,h in enumerate(allh,1):
    x=d.cell(1,c,h); x.font=F(bold=True,color="FFFFFF"); x.alignment=Alignment(wrap_text=True,vertical="center",horizontal="center")
    x.fill=HF if c<=25 else PatternFill("solid",fgColor="548235")
for r,v in enumerate(rows,2):
    for c,val in enumerate(v,1):
        x=d.cell(r,c,val); x.font=F(color="0000FF")
for r in range(2,N+2):
    d[f"Z{r}"]=f'=IF($A{r}="","",E{r}-D{r})'
    d[f"AA{r}"]=f'=IF($A{r}="","",IF(E{r}<=G{r},1,0))'
    d[f"AB{r}"]=f'=IF($A{r}="","",IF(E{r}<=F{r},1,0))'
    d[f"AC{r}"]=f'=IF($A{r}="","",MAX(0,E{r}-G{r}))'
    d[f"AD{r}"]=f'=IF($A{r}="","",MAX(0,E{r}-F{r}))'
    d[f"AE{r}"]=f'=IF($A{r}="","",D{r}-WEEKDAY(D{r},2)+1)'
    d[f"AF{r}"]=f'=IF($A{r}="","",IF(AND(AC{r}>0,AG{r}=1),MAX($AF$1:AF{r-1})+1,""))'
    d[f"AG{r}"]=f'=IF($A{r}="","",IF(COUNTIF($B$2:B{r},B{r})=1,1,0))'
    d[f"AH{r}"]=f'=IF($A{r}="","",TEXT(D{r},"ddd"))'
    d[f"AI{r}"]=f'=IF($A{r}="","",TEXT(E{r},"ddd"))'
    d[f"AJ{r}"]=f'=IF($A{r}="","",TEXT(D{r},"yyyy-mm"))'
    d[f"AK{r}"]=f'=IF($A{r}="","",IF(O{r}<1000,"A: <1,000 lbs",IF(O{r}<2500,"B: 1,000-2,499 lbs",IF(O{r}<4000,"C: 2,500-3,999 lbs","D: 4,000+ lbs"))))'
    d[f"AL{r}"]=f'=IF($A{r}="","",S{r}&" > "&U{r})'
    d[f"AM{r}"]=f'=IF($A{r}="","",IF(Z{r}=0,"0: Same Day",IF(Z{r}<=2,"A: 1-2 days",IF(Z{r}<=5,"B: 3-5 days",IF(Z{r}<=7,"C: 6-7 days",IF(Z{r}<=10,"D: 8-10 days",IF(Z{r}<=14,"E: 11-14 days","F: 15+ days")))))))'
    d[f"AN{r}"]=f'=IF($A{r}="","",IF(L{r}=Y{r},"Intra-Province","Inter-Province"))'
    d[f"AO{r}"]=f'=IF($A{r}="","",IF(COUNTIF($C$2:$C${N+1},C{r})>1,"Consolidated","Single"))'
    d[f"AP{r}"]=f'=IF($A{r}="","",IF(COUNTIF($C$2:C{r},C{r})=1,1,0))'
    for col in ("Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP"):
        d[f"{col}{r}"].font=F(); d[f"{col}{r}"].fill=CALC
    for col in ("D","E","F","G","AE"): d[f"{col}{r}"].number_format="yyyy-mm-dd"
d["AF1"].value="Late Seq (7-day)"
d.row_dimensions[1].height=45; d.freeze_panes="B2"; d.auto_filter.ref=f"A1:AP{len(rows)+1}"
for c in range(1,43): d.column_dimensions[L(c)].width=14
d.column_dimensions["J"].width=38
d.conditional_formatting.add(f"AA2:AB{N+1}",CellIsRule(operator="equal",formula=["0"],fill=PatternFill("solid",fgColor="F8CBAD")))

R=lambda col:f"Data!${col}$2:${col}${N+1}"
DAYS,OTP7,OTP14,LATE7,U,WT=R("Z"),R("AA"),R("AB"),R("AC"),R("AG"),R("O")

# ---------- Summaries ----------
s=wb.create_sheet("Summaries")
s["A1"]="Shipping Performance Summaries"; s["A1"].font=F(bold=True,size=14,color=NAVY)
s["A2"]="On time = Delivery date <= Must-Deliver date. OTP 7 uses column G, OTP 14 uses column F. Transit days = Delivery - Shipping (calendar days). Add new group names in column A of a table if new values appear in Data."
s["A2"].font=F(italic=True,size=9,color="595959")
cols=["Delivery Pros","Avg Days","Min Days","Max Days","OTP 7-Day %","OTP 14-Day %","Late Pros (7-Day)","Avg Days Late (7)","Late Pros (14-Day)","Total Weight (lbs)","% of Pros"]
pos={}
def table(r0,title,keycol,keys,fmt=None):
    s.cell(r0,1,title).font=F(bold=True,size=12,color=NAVY)
    for c,h in enumerate([title.split("by ")[-1]]+cols,1):
        x=s.cell(r0+1,c,h); x.font=F(bold=True,color="FFFFFF"); x.fill=HF; x.alignment=Alignment(horizontal="center",wrap_text=True); x.border=BD
    K=R(keycol)+","+U+",1"
    for i,k in enumerate(keys):
        r=r0+2+i; a=f"$A{r}"
        s.cell(r,1,k).font=F(color="0000FF")
        if fmt: s.cell(r,1).number_format=fmt
        Kc=R(keycol); Kx=f"{Kc},{a},{U},1"
        f=[f'=COUNTIFS({Kx})',
           f'=IFERROR(AVERAGEIFS({DAYS},{Kx}),0)',
           f'=_xlfn.MINIFS({DAYS},{Kx})',
           f'=_xlfn.MAXIFS({DAYS},{Kx})',
           f'=IFERROR(SUMIFS({OTP7},{Kx})/B{r},0)',
           f'=IFERROR(SUMIFS({OTP14},{Kx})/B{r},0)',
           f'=B{r}-SUMIFS({OTP7},{Kx})',
           f'=IFERROR(SUMIFS({LATE7},{Kx},{R("AC")},">0")/H{r},0)',
           f'=B{r}-SUMIFS({OTP14},{Kx})',
           f'=SUMIFS({WT},{Kx})',
           f'=IFERROR(B{r}/SUM({U}),0)']
        nf=["0","0.00","0","0","0.0%","0.0%","0","0.0","0","#,##0","0.0%"]
        for c,(ff,n) in enumerate(zip(f,nf),2):
            x=s.cell(r,c,ff); x.font=F(); x.number_format=n; x.border=BD
        s.cell(r,1).border=BD
        s.cell(r,26,f'=IF(B{r}>0,C{r}+ROW()/100000,-1)').font=F(color="A6A6A6",size=8)
    end=r0+1+len(keys)
    s.conditional_formatting.add(f"F{r0+2}:G{end}",CellIsRule(operator="lessThan",formula=["0.9"],fill=PatternFill("solid",fgColor="F8CBAD"),font=Font(color="9C0006")))
    s.conditional_formatting.add(f"F{r0+2}:G{end}",CellIsRule(operator="greaterThanOrEqual",formula=["0.9"],fill=PatternFill("solid",fgColor="C6EFCE"),font=Font(color="006100")))
    pos[title]=(r0+1,end)
    return end+3

uniq=lambda i: sorted({v[i] for v in rows},key=lambda x:str(x).upper())
DOW=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
def wb_(w): return "A: <1,000 lbs" if w<1000 else "B: 1,000-2,499 lbs" if w<2500 else "C: 2,500-3,999 lbs" if w<4000 else "D: 4,000+ lbs"
months=sorted({v[3].strftime("%Y-%m") for v in rows})
lanes=sorted({v[18]+" > "+v[20] for v in rows})
weeks=sorted({(v[3]-dt.timedelta(days=v[3].weekday())) for v in rows})
r=4
r=table(r,"Avg Days by Province","L",uniq(11))
r=table(r,"Avg Days by City","K",uniq(10))
r=table(r,"Avg Days by DEL TERM","U",uniq(20))
r=table(r,"Avg Days by DEL CARRIER","V",uniq(21))
r=table(r,"Avg Days by ZONE","W",uniq(22))
r=table(r,"Avg Days by Dealer","I",uniq(8))
r=table(r,"Avg Days by CLASSIFICATION","P",uniq(15))
r=table(r,"Trend by WAVE","A",uniq(0))
r=table(r,"Trend by Ship Week","AE",weeks,"yyyy-mm-dd")
r=table(r,"Trend by Ship Month","AJ",months)
r=table(r,"Distribution by Transit Bucket","AM",["0: Same Day","A: 1-2 days","B: 3-5 days","C: 6-7 days","D: 8-10 days","E: 11-14 days","F: 15+ days"])
r=table(r,"Avg Days by Weight Band","AK",["A: <1,000 lbs","B: 1,000-2,499 lbs","C: 2,500-3,999 lbs","D: 4,000+ lbs"])
r=table(r,"Avg Days by Lane","AL",lanes)
r=table(r,"Avg Days by PU CARRIER","T",uniq(19))
r=table(r,"Avg Days by DEST BR","Q",uniq(16))
r=table(r,"Avg Days by ALLOCATION FILE","R",uniq(17))
r=table(r,"Avg Days by Province Flow","AN",["Intra-Province","Inter-Province"])
r=table(r,"Avg Days by Billing Type","AO",["Single","Consolidated"])
r=table(r,"Avg Days by Ship Day","AH",DOW)
r=table(r,"Avg Days by Delivery Day","AI",DOW)
# dealer names next to dealer table
h,e=pos["Avg Days by Dealer"]
s.cell(h,13,"Dealer name").font=F(bold=True,color="FFFFFF"); s.cell(h,13).fill=HF
for rr in range(h+1,e+1):
    s.cell(rr,13,f'=IFERROR(INDEX(Data!$J:$J,MATCH(A{rr},Data!$I:$I,0)),"")').font=F()
s.column_dimensions["Z"].hidden=True; s.column_dimensions["A"].width=26; s.column_dimensions["M"].width=38
for c in "BCDEFGHIJKL": s.column_dimensions[c].width=12

# ---------- Late Shipments ----------
x=wb.create_sheet("Late Shipments")
x["A1"]="Exceptions: Late vs 7-Day Target (auto-updates from Data)"; x["A1"].font=F(bold=True,size=14,color=NAVY)
lh=[("#",None),("WAVE","A"),("DELIVERY PROBILL","B"),("Dealer name","J"),("City","K"),("Province","L"),("DEL TERM","U"),("DEL CARRIER","V"),("Shipping Date","D"),("Delivery date","E"),("Must by -7","G"),("Transit Days","Z"),("Days Late (7)","AC"),("On Time 14?","AB")]
for c,(h,_) in enumerate(lh,1):
    y=x.cell(3,c,h); y.font=F(bold=True,color="FFFFFF"); y.fill=PatternFill("solid",fgColor="C00000"); y.border=BD
for i in range(1,201):
    rr=3+i
    x.cell(rr,1,f'=IF({i}<=MAX(Data!$AF:$AF),{i},"")').font=F()
    for c,(h,col) in enumerate(lh[1:],2):
        y=x.cell(rr,c,f'=IF($A{rr}="","",INDEX(Data!${col}:${col},MATCH($A{rr},Data!$AF:$AF,0)))'); y.font=F()
        if col in "DEG": y.number_format="yyyy-mm-dd"
    x.cell(rr,14).value=f'=IF($A{rr}="","",IF(INDEX(Data!$AB:$AB,MATCH($A{rr},Data!$AF:$AF,0))=1,"Yes","No"))'
for c,w in zip("ABCDEFGHIJKLMN",[5,7,16,38,15,9,10,13,13,13,13,11,12,11]): x.column_dimensions[c].width=w
x.freeze_panes="A4"

# ---------- Dashboard ----------
db=wb.create_sheet("Dashboard",0)
db.sheet_view.showGridLines=False
db["B1"]="Shipping Performance Dashboard"; db["B1"].font=F(bold=True,size=18,color=NAVY)
db["B2"]="All figures calculate from the Data tab. Paste new rows into Data (columns A:Y) — formulas cover up to 2,000 rows."; db["B2"].font=F(italic=True,size=9,color="595959")
TP=f"SUM({U})"
kpis=[("Delivery Pros",f'={TP}',"0"),
      ("Billing Pros",f'=SUM({R("AP")})',"0"),
      ("Avg Transit Days",f'=IFERROR(SUMIFS({DAYS},{U},1)/{TP},0)',"0.00"),
      ("OTP 7-Day %",f'=IFERROR(SUMIFS({OTP7},{U},1)/{TP},0)',"0.0%"),
      ("OTP 14-Day %",f'=IFERROR(SUMIFS({OTP14},{U},1)/{TP},0)',"0.0%"),
      ("Late Pros (7-Day)",f'={TP}-SUMIFS({OTP7},{U},1)',"0"),
      ("Late Pros (14-Day)",f'={TP}-SUMIFS({OTP14},{U},1)',"0"),
      ("Median Transit Days",f'=MEDIAN({DAYS})',"0.0"),
      ("90th Pctl Transit Days",f'=PERCENTILE({DAYS},0.9)',"0.0"),
      ("Max Transit Days",f'=_xlfn.MAXIFS({DAYS},{U},1)',"0"),
      ("Avg Days Late (Late 7)",f'=IFERROR(SUMIFS({LATE7},{U},1)/({TP}-SUMIFS({OTP7},{U},1)),0)',"0.0"),
      ("Total Weight (lbs)",f'=SUMIFS({WT},{U},1)',"#,##0"),
      ("Avg Weight / Pro",f'=IFERROR(SUMIFS({WT},{U},1)/{TP},0)',"#,##0"),
      ("Same-Day Delivered %",f'=IFERROR(COUNTIFS({DAYS},0,{U},1)/{TP},0)',"0.0%"),
      ("Consolidated Pros %",f'=IFERROR(COUNTIFS({R("AO")},"Consolidated",{U},1)/{TP},0)',"0.0%")]
for i,(lab,f,nf) in enumerate(kpis):
    rr0=4 if i<8 else 8
    c=2+(i%8)*3
    db.merge_cells(start_row=rr0,start_column=c,end_row=rr0,end_column=c+2)
    db.merge_cells(start_row=rr0+1,start_column=c,end_row=rr0+2,end_column=c+2)
    a=db.cell(rr0,c,lab); a.font=F(bold=True,color="FFFFFF",size=10); a.fill=HF; a.alignment=Alignment(horizontal="center")
    b=db.cell(rr0+1,c,f); b.font=F(bold=True,size=20,color=NAVY); b.number_format=nf; b.alignment=Alignment(horizontal="center",vertical="center"); b.fill=PatternFill("solid",fgColor="DDEBF7")
for c in range(1,30): db.column_dimensions[L(c)].width=7
db.column_dimensions["A"].width=2

def chart(kind,title,key,valcols,anchor,ytitle,pct=False,w=16,h=7.5):
    hr,e=pos[key]
    ch=LineChart() if kind=="line" else BarChart()
    if kind=="bar": ch.type="bar"; ch.gapWidth=60
    ch.title=title; ch.y_axis.title=ytitle; ch.height=h; ch.width=w; ch.legend.position="b"
    for vc in valcols:
        ch.add_data(Reference(s,min_col=vc,min_row=hr,max_row=e),titles_from_data=True)
    ch.set_categories(Reference(s,min_col=1,min_row=hr+1,max_row=e))
    if pct: ch.y_axis.number_format="0%"; ch.y_axis.scaling.min=0; ch.y_axis.scaling.max=1
    if kind=="line":
        for se in ch.series: se.marker.symbol="circle"; se.smooth=False
    ch.y_axis.delete=False; ch.x_axis.delete=False
    db.add_chart(ch,anchor)
CH=[("line","OTP % Trend by Ship Week","Trend by Ship Week",[6,7],"OTP %",True),
("line","Avg & Max Transit Days by Ship Week","Trend by Ship Week",[3,5],"Days",False),
("bar_v","Delivery Pro Volume by Ship Week","Trend by Ship Week",[2],"Pros",False),
("line","OTP % by Wave","Trend by WAVE",[6,7],"OTP %",True),
("line","OTP % Trend by Month","Trend by Ship Month",[6,7],"OTP %",True),
("bar_v","Transit Days Distribution","Distribution by Transit Bucket",[2],"Pros",False),
("bar","Avg Transit Days by City","Avg Days by City",[3],"Days",False),
("bar","OTP % by City","Avg Days by City",[6,7],"OTP %",True),
("bar","Avg Transit Days by Province","Avg Days by Province",[3],"Days",False),
("bar","Avg Transit Days by DEL TERM","Avg Days by DEL TERM",[3],"Days",False),
("bar","OTP % by DEL TERM","Avg Days by DEL TERM",[6,7],"OTP %",True),
("bar","OTP % by DEL CARRIER","Avg Days by DEL CARRIER",[6,7],"OTP %",True),
("bar","Avg Transit Days by Dealer","Avg Days by Dealer",[3],"Days",False),
("bar","Avg Transit Days by Zone","Avg Days by ZONE",[3],"Days",False),
("bar","Avg Transit Days by Lane","Avg Days by Lane",[3],"Days",False),
("bar_v","Avg Transit Days by Weight Band","Avg Days by Weight Band",[3],"Days",False),
("bar_v","OTP % by Classification","Avg Days by CLASSIFICATION",[6,7],"OTP %",True),
("bar_v","Avg Transit Days by Ship Day","Avg Days by Ship Day",[3],"Days",False)]
def chart2(kind,title,key,valcols,ytitle,pct,anchor):
    hr,e=pos[key]
    ch=LineChart() if kind=="line" else BarChart()
    if kind=="bar": ch.type="bar"; ch.gapWidth=60
    if kind=="bar_v": ch.type="col"; ch.gapWidth=60
    ch.title=title; ch.y_axis.title=ytitle; ch.height=7.5; ch.width=14.5; ch.legend.position="b"
    for vc in valcols: ch.add_data(Reference(s,min_col=vc,min_row=hr,max_row=e),titles_from_data=True)
    ch.set_categories(Reference(s,min_col=1,min_row=hr+1,max_row=e))
    if pct: ch.y_axis.number_format="0%"; ch.y_axis.scaling.min=0; ch.y_axis.scaling.max=1
    if kind=="line":
        for se in ch.series: se.marker.symbol="circle"; se.smooth=False
    if len(valcols)==1: ch.legend=None
    ch.y_axis.delete=False; ch.x_axis.delete=False
    db.add_chart(ch,anchor)
for i,c in enumerate(CH):
    col=["B","J","R"][i%3]; row=12+(i//3)*16
    chart2(*c,f"{col}{row}")

# ---------- Heatmaps ----------
from openpyxl.formatting.rule import ColorScaleRule
hm=wb.create_sheet("Heatmaps")
hm["A1"]="Heatmaps (Delivery Pros)"; hm["A1"].font=F(bold=True,size=14,color=NAVY)
def matrix(r0,title,rk,rvals,ck,cvals,metric):
    hm.cell(r0,1,title).font=F(bold=True,size=12,color=NAVY)
    for j,cv in enumerate(cvals,2):
        y=hm.cell(r0+1,j,cv); y.font=F(bold=True,color="FFFFFF"); y.fill=HF; y.alignment=Alignment(horizontal="center",wrap_text=True)
    for i,rv in enumerate(rvals,r0+2):
        y=hm.cell(i,1,rv); y.font=F(bold=True,color="0000FF")
        for j,cv in enumerate(cvals,2):
            cr=f"{R(rk)},$A{i},{R(ck)},{L(j)}${r0+1},{U},1"
            if metric=="days": f=f'=IFERROR(AVERAGEIFS({DAYS},{cr}),"")'; nf="0.0"
            elif metric=="otp7": f=f'=IFERROR(SUMIFS({OTP7},{cr})/COUNTIFS({cr}),"")'; nf="0%"
            else: f=f'=IF(COUNTIFS({cr})=0,"",COUNTIFS({cr}))'; nf="0"
            y=hm.cell(i,j,f); y.font=F(); y.number_format=nf; y.border=BD; y.alignment=Alignment(horizontal="center")
    rng=f"B{r0+2}:{L(len(cvals)+1)}{r0+1+len(rvals)}"
    if metric=="otp7": hm.conditional_formatting.add(rng,ColorScaleRule(start_type="num",start_value=0,start_color="F8696B",mid_type="num",mid_value=0.5,mid_color="FFEB84",end_type="num",end_value=1,end_color="63BE7B"))
    else: hm.conditional_formatting.add(rng,ColorScaleRule(start_type="min",start_color="63BE7B",mid_type="percentile",mid_value=50,mid_color="FFEB84",end_type="max",end_color="F8696B"))
    return r0+len(rvals)+4
r=3
r=matrix(r,"Avg Transit Days: Province x DEL CARRIER","L",uniq(11),"V",uniq(21),"days")
r=matrix(r,"OTP 7-Day %: Province x DEL CARRIER","L",uniq(11),"V",uniq(21),"otp7")
r=matrix(r,"Avg Transit Days: DEL TERM x Wave","U",uniq(20),"A",uniq(0),"days")
r=matrix(r,"OTP 7-Day %: City x Wave","K",uniq(10),"A",uniq(0),"otp7")
r=matrix(r,"Delivery Pros: Ship Day x Delivery Day","AH",DOW,"AI",DOW,"count")
r=matrix(r,"Avg Transit Days: Weight Band x Classification","AK",["A: <1,000 lbs","B: 1,000-2,499 lbs","C: 2,500-3,999 lbs","D: 4,000+ lbs"],"P",uniq(15),"days")
hm.column_dimensions["A"].width=22
for c in range(2,12): hm.column_dimensions[L(c)].width=13

# ---------- Rankings ----------
rk=wb.create_sheet("Rankings")
rk["A1"]="Rankings - Worst performers first (auto-sorted by Avg Transit Days)"; rk["A1"].font=F(bold=True,size=14,color=NAVY)
def ranking(c0,key,label,n=10):
    hr,e=pos[key]; cnt=e-hr
    rk.cell(3,c0,label).font=F(bold=True,size=12,color=NAVY)
    for j,h in enumerate(["Rank",label.replace("Slowest ",""),"Avg Days","OTP 7 %","OTP 14 %","Pros"]):
        y=rk.cell(4,c0+j,h); y.font=F(bold=True,color="FFFFFF"); y.fill=HF
    A=f"Summaries!$A${hr+1}:$A${e}"; C=f"Summaries!$C${hr+1}:$C${e}"; B=f"Summaries!$B${hr+1}:$B${e}"
    for i in range(1,min(n,cnt)+1):
        rr=4+i
        rk.cell(rr,c0,i).font=F()
        # rank by avg days descending with tie-break on row order, only groups with pros
        Z=f"Summaries!$Z${hr+1}:$Z${e}"
        rk.cell(rr,c0+1,f'=IFERROR(IF(LARGE({Z},{i})<0,"",INDEX({A},MATCH(LARGE({Z},{i}),{Z},0))),"")').font=F()
        for j,col in enumerate(["C","F","G","B"],2):
            y=rk.cell(rr,c0+j,f'=IF({L(c0+1)}{rr}="","",INDEX(Summaries!${col}${hr+1}:${col}${e},MATCH({L(c0+1)}{rr},{A},0)))'); y.font=F()
            y.number_format=["0.00","0.0%","0.0%","0"][j-2]
ranking(1,"Avg Days by City","Slowest City")
ranking(8,"Avg Days by Dealer","Slowest Dealer")
ranking(15,"Avg Days by DEL CARRIER","Slowest DEL CARRIER")
ranking(22,"Avg Days by Lane","Slowest Lane")
for c in range(1,29): rk.column_dimensions[L(c)].width=11
for c in (2,9,16,23): rk.column_dimensions[L(c)].width=20

# ---------- Notes ----------
n=wb.create_sheet("How To Use")
notes=["HOW TO USE",
"1. Paste new shipment rows into Data, columns A:Y (same column order). Blue text = your input.",
"2. Green columns Z:AF are formulas - do not overwrite. They are pre-filled to row 2001.",
"3. Summaries tables use COUNTIFS/AVERAGEIFS. If a new City/Dealer/Carrier/Week/Wave appears, add it in column A of that table (copy a row down).",
"4. Charts on Dashboard read from Summaries - extend chart range (right-click > Select Data) if you add rows.",
"5. Late Shipments tab lists every shipment late vs the 7-day target automatically.",
"",
"DEFINITIONS",
"Transit Days = Delivery date - Shipping date (calendar days). 0 = delivered same day. For business days, change Data!Z to =NETWORKDAYS(D2,E2)-1.",
"OTP 7-Day = 1 if Delivery date <= 'Must Delivered by -7 DAYS' (col G), else 0.",
"OTP 14-Day = 1 if Delivery date <= 'Must Delivered by -14 DAYS' (col F), else 0.",
"OTP % = on-time shipments / total shipments. Red highlight = below 90%.",
"Ship Week = Monday of the shipping-date week.",
"All metrics count UNIQUE DELIVERY PROBILLS (Data!AG). A repeated delivery probill is counted once (first row).",
"Billing Pros = unique billing probills. Consolidated = billing probill covering >1 delivery pro.",
"Province Flow: Intra = destination province equals ORIG PROV CHK; otherwise Inter.",
"Lane = PU TERM > DEL TERM.",
"",
"TABS",
"Dashboard - KPI tiles + 18 charts.  Summaries - 21 breakdown tables.  Heatmaps - cross-tab color matrices.",
"Rankings - worst 10 cities/dealers/carriers/lanes.  Late Shipments - every delivery pro late vs 7-day target."]
for i,t in enumerate(notes,1):
    n.cell(i,1,t).font=F(bold=t.isupper() and t!="",size=12 if t.isupper() else 10)
n.column_dimensions["A"].width=130
wb.save("/home/user/ramanFX/analytics/Shipping_Performance_Dashboard.xlsx")
