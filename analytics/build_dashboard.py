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
     "Days Late (14)":f'MAX(0,{T}[[#This Row],[Delivery date]]-{T}[[#This Row],[Must Delivered by -14 DAYS]])',
     "Ship Month":f'TEXT({T}[[#This Row],[Shipping Date]],"yyyy-mm")',
     "Week Start":f'{T}[[#This Row],[Shipping Date]]-WEEKDAY({T}[[#This Row],[Shipping Date]],2)+1'}
wb=Workbook(); d=wb.active; d.title="Data"
H=hdr+list(add)
for c,h in enumerate(H,1): d.cell(1,c,h)
for r,v in enumerate(rows,2):
    for c,x in enumerate(v,1): d.cell(r,c,x)
    for j,f in enumerate(add.values(),len(hdr)+1): d.cell(r,j,"="+f)
    for c in (4,5,6,7,31): d.cell(r,c).number_format="yyyy-mm-dd"
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
s["A2"]="On time = delivered on or before the must-deliver date. Counts are by delivery probill. Avg Days Late = average over late pros only. Month = ship month."; s["A2"].font=Font(italic=True,color="7F7F7F")
c=lambda n:f"{T}[{n}]"
heads=["# of Pros","Avg Days","Min Days","Max Days","On Time 7","OTP 7 Days %","Avg Days Late 7","On Time 14","OTP 14 Days %","Avg Days Late 14"]
NF=["0","0.0","0","0","0","0.0%","0.0","0","0.0%","0.0"]
NC=len(heads)+1
DAYS=c('total days to deliver'); L7=c('Days Late (7)'); L14=c('Days Late (14)')
def hrow(r,first):
    for j,h in enumerate([first]+heads,1):
        x=s.cell(r,j,h); x.font=bold; x.fill=grey; x.border=bd; x.alignment=Alignment(horizontal="center",wrap_text=True)
def fmt(r):
    for j,nf in enumerate(NF,2): s.cell(r,j).number_format=nf; s.cell(r,j).border=bd
    s.cell(r,1).border=bd
def metrics(rr,K):
    k=","+K if K else ""
    cnt=f"COUNTIFS({K})" if K else f"COUNTA({c('DELIVERY PROBILL')})"
    f=[f"={cnt}",
       f"=IFERROR(AVERAGEIFS({DAYS}{k}),0)" if K else f"=AVERAGE({DAYS})",
       f"=_xlfn.MINIFS({DAYS}{k})" if K else f"=MIN({DAYS})",
       f"=_xlfn.MAXIFS({DAYS}{k})" if K else f"=MAX({DAYS})",
       f'=COUNTIFS({c("On Time 7 Days")},"Yes"{k})',
       f"=IFERROR(F{rr}/B{rr},0)",
       f'=IFERROR(AVERAGEIFS({L7},{L7},">0"{k}),0)',
       f'=COUNTIFS({c("On Time 14 Days")},"Yes"{k})',
       f"=IFERROR(I{rr}/B{rr},0)",
       f'=IFERROR(AVERAGEIFS({L14},{L14},">0"{k}),0)']
    for j,x in enumerate(f,2): s.cell(rr,j,x)
    fmt(rr)
pos={}
r=4
s.cell(r,1,"Overall").font=Font(bold=True,size=12); hrow(r+1,"")
s.cell(r+2,1,"All Pros"); metrics(r+2,None); r+=5
def table(title,col,keys,datefmt=False,extra=None):
    global r
    s.cell(r,1,title).font=Font(bold=True,size=12); hrow(r+1,col)
    if extra: x=s.cell(r+1,NC+1,extra[0]); x.font=bold; x.fill=grey; x.border=bd
    a=r+2
    for i,k in enumerate(keys):
        rr=a+i; s.cell(rr,1,k)
        if datefmt: s.cell(rr,1).number_format="yyyy-mm-dd"
        metrics(rr,f"{c(col)},$A{rr}")
        if extra: s.cell(rr,NC+1,extra[1].format(r=rr)).border=bd
    e=a+len(keys)-1; t=e+1
    s.cell(t,1,"Grand Total"); metrics(t,None)
    for j in range(1,NC+1): s.cell(t,j).font=bold
    pos[title]=(r+1,e); r=t+3
u=lambda i: sorted({v[i] for v in rows},key=lambda x:str(x).upper())
table("By Province","Province",u(11))
table("By City","City",u(10))
table("By Dealer","Dealer code",u(8),extra=("Dealer name",'=IFERROR(INDEX(Shipments[Dealer name],MATCH(A{r},Shipments[Dealer code],0)),"")'))
table("By DEL TERM","DEL TERM",u(20))
table("By DEL CARRIER","DEL CARRIER",u(21))
table("By ZONE","ZONE",u(22))
table("By CLASSIFICATION","CLASSIFICATION",u(15))
table("By Month","Ship Month",sorted({v[3].strftime("%Y-%m") for v in rows}))
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
s.column_dimensions["A"].width=30; s.column_dimensions["L"].width=36
for j in "BCDEFGHIJK": s.column_dimensions[j].width=11
for rr in range(1,s.max_row+1):
    if s.cell(rr,2).value=="# of Pros": s.row_dimensions[rr].height=30

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
chart("line","OTP % by Month","By Month",[7,10],"A1",True)
chart("col","OTP % by DEL CARRIER","By DEL CARRIER",[7,10],"K1",True)
chart("bar","Avg Days by City","By City",[3],"A18")
wb.active=1
wb.save(sys.argv[2])
