import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { IOrder } from "../types.d";

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Plain number — used for item prices, subtotals, shipping */
const money = (n: number) => n.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** With BDT prefix — used only for the grand total */
const moneyBDT = (n: number) => `BDT ${money(n)}`;

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#222222",
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 52,
    paddingRight: 52,
  },

  // ── Header
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo: { width: 140, height: 34, objectFit: "contain", objectPositionX: 0, objectPositionY: 0 },
  contactLine: { fontSize: 7.5, color: "#999999", marginTop: 6 },
  divider: { borderBottomWidth: 0.5, borderBottomColor: "#DDDDDD", marginVertical: 16 },

  // ── Bill To / Invoice block
  billingRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  sectionHeading: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111111", marginBottom: 10 },

  // Left column
  leftCol: { flex: 1, paddingRight: 20 },
  metaRow: { flexDirection: "row", marginBottom: 6 },
  metaLabel: { fontFamily: "Helvetica-Bold", color: "#222222", marginRight: 3 },
  metaValue: { fontFamily: "Helvetica", color: "#555555", flex: 1 },

  // Right column
  rightCol: { width: "46%", alignItems: "flex-end" },
  rightRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: 6, gap: 4 },
  rightLabel: { fontFamily: "Helvetica-Bold", color: "#222222", fontSize: 8.5 },
  rightValue: { fontFamily: "Helvetica", color: "#555555", fontSize: 8.5 },

  // ── Table
  tableSection: { marginTop: 28 },
  tableHeaderRule: { borderBottomWidth: 0.5, borderBottomColor: "#CCCCCC", marginBottom: 8 },
  tableHeader: { flexDirection: "row", paddingBottom: 8 },
  thNo: { width: 28, fontFamily: "Helvetica-Bold", color: "#111111" },
  thDesc: { flex: 1, fontFamily: "Helvetica-Bold", color: "#111111" },
  thPrice: { width: 72, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#111111" },
  thQty: { width: 52, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#111111" },
  thTotal: { width: 72, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#111111" },
  tableHeaderRule2: { borderBottomWidth: 0.5, borderBottomColor: "#CCCCCC", marginBottom: 0 },

  // Item row
  itemRow: { flexDirection: "row", paddingVertical: 10, alignItems: "flex-start" },
  itemRule: { borderBottomWidth: 0.4, borderBottomColor: "#EEEEEE" },
  tdNo: { width: 28, color: "#AAAAAA" },
  tdDesc: { flex: 1 },
  tdTitle: { fontFamily: "Helvetica-Bold", color: "#222222", marginBottom: 2 },
  tdAttr: { fontSize: 7.5, color: "#AAAAAA" },
  tdPrice: { width: 72, textAlign: "right", color: "#555555" },
  tdQty: { width: 52, textAlign: "right", color: "#555555" },
  tdTotal: { width: 72, textAlign: "right", color: "#555555" },

  // ── Totals
  totalsSection: { marginTop: 6 },
  totRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  totLabel: { color: "#555555" },
  totValue: { color: "#555555" },
  totDivider: { borderBottomWidth: 0.5, borderBottomColor: "#CCCCCC", marginVertical: 4 },
  grandRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  grandLabel: { fontFamily: "Helvetica-Bold", color: "#111111", fontSize: 10 },
  grandValue: { fontFamily: "Helvetica-Bold", color: "#111111", fontSize: 10 },

  // ── Footer
  footer: { position: "absolute", bottom: 36, left: 52, right: 52 },
  footerRule: { borderBottomWidth: 0.5, borderBottomColor: "#DDDDDD", marginBottom: 8 },
  footerRow: { flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7.5, color: "#AAAAAA", flex: 1 },
  footerPage: { fontSize: 7.5, color: "#AAAAAA" },
});

// ── Component ─────────────────────────────────────────────────────────────────
interface InvoicePDFProps {
  order: IOrder;
}

const InvoicePDF = ({ order }: InvoicePDFProps) => {
  const billing = order.billingDetails;
  const shipping = order.shippingDetails;
  const payment = order.paymentId;

  const invoiceNo = `INV_${order.orderNumber}`;
  const payMethod = payment?.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery";
  const payStatus = payment?.status ?? "UNPAID";
  const statusColor =
    payStatus === "PAID" ? "#16a34a" : payStatus === "FAILED" || payStatus === "CANCELLED" ? "#dc2626" : "#555555";

  const safeOrderNumber = order.orderNumber.replace(/^SG-/, "");
  const filename = `StarGadgets_INV_${safeOrderNumber}.pdf`;
  // @react-pdf/renderer needs an absolute URL to fetch the image
  const logoUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/logo.png`;

  return (
    <Document title={filename} author="Star Gadgets">
      <Page size="A4" style={s.page}>
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={s.headerRow}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={s.logo} src={logoUrl} />
            <Text style={s.contactLine}>
              star-gadgets-client.vercel.app · jubayerhossain111220@gmail.com · Bangladesh
            </Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Bill To + Invoice meta ───────────────────────────────────── */}
        <View style={s.billingRow}>
          {/* Left: Bill To */}
          <View style={s.leftCol}>
            <Text style={s.sectionHeading}>Bill To</Text>

            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Name :</Text>
              <Text style={s.metaValue}>
                {billing.firstName} {billing.lastName}
              </Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Phone :</Text>
              <Text style={s.metaValue}>{billing.phone}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Email :</Text>
              <Text style={s.metaValue}>{billing.email}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Address :</Text>
              <Text style={s.metaValue}>
                {[billing.streetAddress, billing.city, billing.district, billing.postcode].filter(Boolean).join(", ")}
              </Text>
            </View>
            {shipping && (
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>Ship To :</Text>
                <Text style={s.metaValue}>
                  {shipping.firstName} {shipping.lastName},{" "}
                  {[shipping.streetAddress, shipping.city, shipping.district, shipping.postcode]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            )}
          </View>

          {/* Right: Invoice meta */}
          <View style={s.rightCol}>
            <Text style={[s.sectionHeading, { textAlign: "right" }]}>Invoice</Text>

            <View style={s.rightRow}>
              <Text style={s.rightLabel}>Invoice Number :</Text>
              <Text style={s.rightValue}>{invoiceNo}</Text>
            </View>
            <View style={s.rightRow}>
              <Text style={s.rightLabel}>Invoice Date :</Text>
              <Text style={s.rightValue}>{fmtDate(order.createdAt)}</Text>
            </View>
            <View style={s.rightRow}>
              <Text style={s.rightLabel}>Payment :</Text>
              <Text style={s.rightValue}>{payMethod}</Text>
            </View>
            <View style={s.rightRow}>
              <Text style={s.rightLabel}>Status :</Text>
              <Text style={[s.rightValue, { color: statusColor }]}>{payStatus}</Text>
            </View>
          </View>
        </View>

        {/* ── Items Table ──────────────────────────────────────────────── */}
        <View style={s.tableSection}>
          <View style={s.tableHeaderRule} />
          <View style={s.tableHeader}>
            <Text style={s.thNo}>No</Text>
            <Text style={s.thDesc}>Item Description</Text>
            <Text style={s.thPrice}>Price</Text>
            <Text style={s.thQty}>Quantity</Text>
            <Text style={s.thTotal}>Total</Text>
          </View>
          <View style={s.tableHeaderRule2} />

          {order.items.map((item, idx) => {
            const attrs = item.attributes?.map((a) => `${a.name}: ${a.value}`).join("  ·  ");
            return (
              <View key={item.variantId + idx} wrap={false}>
                <View style={s.itemRow}>
                  <Text style={s.tdNo}>{String(idx + 1).padStart(2, "0")}</Text>
                  <View style={s.tdDesc}>
                    <Text style={s.tdTitle}>{item.title}</Text>
                    {attrs ? <Text style={s.tdAttr}>{attrs}</Text> : null}
                  </View>
                  <Text style={s.tdPrice}>{money(item.price)}</Text>
                  <Text style={s.tdQty}>{item.quantity}</Text>
                  <Text style={s.tdTotal}>{money(item.subtotal)}</Text>
                </View>
                <View style={s.itemRule} />
              </View>
            );
          })}
        </View>

        {/* ── Totals ───────────────────────────────────────────────────── */}
        <View style={s.totalsSection}>
          <View style={s.totRow}>
            <Text style={s.totLabel}>Sub Total :</Text>
            <Text style={s.totValue}>{money(order.subtotal)}</Text>
          </View>
          <View style={s.totRow}>
            <Text style={s.totLabel}>Shipping ({order.shippingMethod}) :</Text>
            <Text style={s.totValue}>{money(order.shippingCost)}</Text>
          </View>
          {order.coupon && order.discount > 0 && (
            <View style={s.totRow}>
              <Text style={s.totLabel}>Coupon ({order.coupon.code}) :</Text>
              <Text style={[s.totValue, { color: "#16a34a" }]}>- {money(order.discount)}</Text>
            </View>
          )}
          <View style={s.totDivider} />
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>Total :</Text>
            <Text style={s.grandValue}>{moneyBDT(order.total)}</Text>
          </View>
        </View>

        {/* ── Order Notes ──────────────────────────────────────────────── */}
        {order.orderNotes ? (
          <View style={{ marginTop: 14 }}>
            <Text style={{ fontSize: 8, color: "#888888" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Note : </Text>
              {order.orderNotes}
            </Text>
          </View>
        ) : null}

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <View style={s.footerRule} />
          <View style={s.footerRow}>
            <Text style={s.footerText}>
              * Bring the invoice copy upon delivery. Support: jubayerhossain111220@gmail.com
            </Text>
            <Text style={s.footerPage} render={({ pageNumber, totalPages }) => `Page ${pageNumber}/${totalPages}`} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
