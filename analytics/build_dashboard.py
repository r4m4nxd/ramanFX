import datetime as dt, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, Reference
from openpyxl.worksheet.table import Table, TableStyleInfo, TableColumn
from openpyxl.utils import get_column_letter as L
exec(open(sys.argv[1]).read())  # loads raw sample rows

hdr=["WAVE","DELIVERY PROBILL","BILLING PROBILL","Shipping Date","Delivery date","Must Delivered by -14 DAYS","Must Delivered by -7 DAYS","total days to deliver","Dealer code","Dealer name","City","Province","Postal Code","Dimension (in)","Weight (lbs)","CLASSIFICATION","DEST BR","ALLOCATION FILE","PU TERM","PU CARRIER","DEL TERM","DEL CARRIER","ZONE","CHK DEST SP","ORIG PROV CHK"]
rows=[]
for line in raw.strip().splitlines():
    v=line.split("\t")
    for i in (3,4,5,6): v[i]=dt.datetime.strptime(v[i],"%Y-%m-%d")
    for i in (1,2): v[i]=int(v[i])
    for i in (7,14): v[i]=int(v[i])
    rows.append(v)

T="Shipments"
add={"On Time 7 Days":f'IF({T}[[#This Row],[Delivery date]]<={T}[[#This Row],[Must Delivered by -7 DAYS]],"Yes","No")',
     "On Time 14 Days":f'IF({T}[[#This Row],[Delivery date]]<={T}[[#This Row],[Must Delivered by -14 DAYS]],"Yes","No")',
     "Days Late (7)":f'MAX(0,{T}[[#This Row],[Delivery date]]-{T}[[#This Row],[Must Delivered by -7 DAYS]])',
     "Week Start":f'{T}[[#This Row],[Shipping Date]]-WEEKDAY({T}[[#This Row],[Shipping Date]],2)+1'}
wb=Workbook(); d=wb.active; d.title="Data"
H=hdr+list(add)
for c,h in enumerate(H,1): d.cell(1,c,h)
for r,v in enumerate(rows,2):
    for c,x in enumerate(v,1): d.cell(r,c,x)
    for j,f in enumerate(add.values(),len(hdr)+1): d.cell(r,j,"="+f)
    for c in (4,5,6,7,29): d.cell(r,c).number_format="yyyy-mm-dd"
tb=Table(displayName=T,ref=f"A1:{L(len(H))}{len(rows)+1}")
tb.tableStyleInfo=TableStyleInfo(name="TableStyleMedium2",showRowStripes=True)
from openpyxl.worksheet.table import TableFormula
tb.tableColumns=[TableColumn(id=i,name=h,calculatedColumnFormula=TableFormula(attr_text=add[h]) if h in add else None) for i,h in enumerate(H,1)]
d.add_table(tb); d.freeze_panes="A2"
for c,h in enumerate(H,1): d.column_dimensions[L(c)].width=max(11,min(len(h)+3,22))
d.column_dimensions["J"].width=36

s=wb.create_sheet("Summary")
bold=Font(bold=True); grey=PatternFill("solid",fgColor="D9D9D9"); thin=Side(style="thin",color="A6A6A6"); bd=Border(left=thin,right=thin,top=thin,bottom=thin)
s["A1"]="Delivery Performance Summary"; s["A1"].font=Font(bold=True,size=14)
s["A2"]="On time = delivered on or before the must-deliver date. Counts are by delivery probill."; s["A2"].font=Font(italic=True,color="7F7F7F")
c=lambda n:f"{T}[{n}]"
heads=["# of Pros","Avg Days","On Time 7","OTP 7 Days %","On Time 14","OTP 14 Days %"]
def hrow(r,first):
    for j,h in enumerate([first]+heads,1):
        x=s.cell(r,j,h); x.font=bold; x.fill=grey; x.border=bd; x.alignment=Alignment(horizontal="center")
def fmt(r):
    for j,nf in enumerate(["0","0.0","0","0.0%","0","0.0%"],2): s.cell(r,j).number_format=nf; s.cell(r,j).border=bd
    s.cell(r,1).border=bd
pos={}
r=4
s.cell(r,1,"Overall").font=Font(bold=True,size=12); hrow(r+1,"")
s.cell(r+2,1,"All Pros")
s.cell(r+2,2,f"=COUNTA({c('DELIVERY PROBILL')})"); s.cell(r+2,3,f"=AVERAGE({c('total days to deliver')})")
s.cell(r+2,4,f'=COUNTIF({c("On Time 7 Days")},"Yes")'); s.cell(r+2,5,f"=IFERROR(D{r+2}/B{r+2},0)")
s.cell(r+2,6,f'=COUNTIF({c("On Time 14 Days")},"Yes")'); s.cell(r+2,7,f"=IFERROR(F{r+2}/B{r+2},0)")
fmt(r+2); r+=5
def table(title,col,keys,datefmt=False,extra=None):
    global r
    s.cell(r,1,title).font=Font(bold=True,size=12); hrow(r+1,col if not datefmt else "Week Start")
    if extra: x=s.cell(r+1,8,extra[0]); x.font=bold; x.fill=grey; x.border=bd
    a=r+2
    for i,k in enumerate(keys):
        rr=a+i; s.cell(rr,1,k)
        if datefmt: s.cell(rr,1).number_format="yyyy-mm-dd"
        K=f"{c(col)},$A{rr}"
        s.cell(rr,2,f"=COUNTIFS({K})")
        s.cell(rr,3,f"=IFERROR(AVERAGEIFS({c('total days to deliver')},{K}),0)")
        s.cell(rr,4,f'=COUNTIFS({K},{c("On Time 7 Days")},"Yes")'); s.cell(rr,5,f"=IFERROR(D{rr}/B{rr},0)")
        s.cell(rr,6,f'=COUNTIFS({K},{c("On Time 14 Days")},"Yes")'); s.cell(rr,7,f"=IFERROR(F{rr}/B{rr},0)")
        if extra: s.cell(rr,8,extra[1].format(r=rr)).border=bd
        fmt(rr)
    e=a+len(keys)-1; t=e+1
    s.cell(t,1,"Grand Total"); s.cell(t,2,f"=SUM(B{a}:B{e})")
    s.cell(t,3,f"=IFERROR(SUMPRODUCT(B{a}:B{e},C{a}:C{e})/B{t},0)")
    s.cell(t,4,f"=SUM(D{a}:D{e})"); s.cell(t,5,f"=IFERROR(D{t}/B{t},0)")
    s.cell(t,6,f"=SUM(F{a}:F{e})"); s.cell(t,7,f"=IFERROR(F{t}/B{t},0)")
    fmt(t)
    for j in range(1,8): s.cell(t,j).font=bold
    pos[title]=(r+1,e); r=t+3
u=lambda i: sorted({v[i] for v in rows},key=lambda x:str(x).upper())
table("By Province","Province",u(11))
table("By City","City",u(10))
table("By Dealer","Dealer code",u(8),extra=("Dealer name",'=IFERROR(INDEX(Shipments[Dealer name],MATCH(A{r},Shipments[Dealer code],0)),"")'))
table("By DEL TERM","DEL TERM",u(20))
table("By DEL CARRIER","DEL CARRIER",u(21))
table("By ZONE","ZONE",u(22))
table("By CLASSIFICATION","CLASSIFICATION",u(15))
table("By WAVE","WAVE",u(0))
table("By Week","Week Start",sorted({v[3]-dt.timedelta(days=v[3].weekday()) for v in rows}),datefmt=True)
# days distribution
s.cell(r,1,"Days to Deliver - Distribution").font=Font(bold=True,size=12)
for j,h in enumerate(["Days","# of Pros","% of Pros"],1):
    x=s.cell(r+1,j,h); x.font=bold; x.fill=grey; x.border=bd
dist0=r+2
for i in range(16):
    rr=dist0+i; s.cell(rr,1,i if i<15 else "15+")
    s.cell(rr,2,f"=COUNTIF({c('total days to deliver')},{i})" if i<15 else f'=COUNTIF({c("total days to deliver")},">=15")')
    s.cell(rr,3,f"=IFERROR(B{rr}/$B$6,0)").number_format="0.0%"
    for j in (1,2,3): s.cell(rr,j).border=bd
s.cell(dist0,4,"0 = same day").font=Font(italic=True,color="7F7F7F")
pos["dist"]=(r+1,dist0+15)
s.column_dimensions["A"].width=40; s.column_dimensions["H"].width=36
for j in "BCDEFG": s.column_dimensions[j].width=13

ch=wb.create_sheet("Charts")
def chart(kind,title,key,cols,anchor,pct=False):
    hr,e=pos[key]
    g=LineChart() if kind=="line" else BarChart()
    if kind=="bar": g.type="bar"
    g.title=title; g.height=8; g.width=16
    for cc in cols: g.add_data(Reference(s,min_col=cc,min_row=hr,max_row=e),titles_from_data=True)
    g.set_categories(Reference(s,min_col=1,min_row=hr+1,max_row=e))
    if pct: g.y_axis.number_format="0%"; g.y_axis.scaling.min=0; g.y_axis.scaling.max=1
    if kind=="line":
        for se in g.series: se.smooth=False; se.marker.symbol="circle"
    if len(cols)==1: g.legend=None
    else: g.legend.position="b"
    g.x_axis.delete=False; g.y_axis.delete=False
    ch.add_chart(g,anchor)
chart("line","OTP % by Week","By Week",[5,7],"A1",True)
chart("line","Avg Days to Deliver by Week","By Week",[3],"K1")
chart("col","OTP % by Province","By Province",[5,7],"A18",True)
chart("col","OTP % by DEL CARRIER","By DEL CARRIER",[5,7],"K18",True)
chart("bar","Avg Days by City","By City",[3],"A35")
chart("col","Days to Deliver - Distribution","dist",[2],"K35")
wb.active=1
wb.save(sys.argv[2])
