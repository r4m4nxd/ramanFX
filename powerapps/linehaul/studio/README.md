# Studio versions

These are the screens as they are in Power Apps Studio. They include your hand edits, and they are the master copy for each screen listed here.

- `scrEntry.yaml`: your pasted Rate entry screen, plus three changes:
  - **Cost breakdown:** shows a prompt until there's a cost.
  - **Add-on and Discount:** use "$ | %" buttons. The switches are kept, hidden, so the formulas still read them.
  - **Active toggle:** set to 150 px wide and aligned left, so the word sits next to the switch.

`HintText: =` on the Comments box is kept exactly as Studio exported it.
- `scrDetails.yaml`: your pasted Rate details screen, plus these changes:
  - **Layout:** Cost on the left; the edit panel (when open), a slim Lane card and "All rates on this lane" on the right.
  - **Lane card:** Service days ("Every day" or "Mon, Tue, …"), Expires in (same colour ramp as Recent), Effective and Expiry. Origin, Destination and Carrier are dropped because the heading already shows them.
  - **Status pill:** sits right after the chips. "Submitted by …" sits at the right of that row, so it's always visible; the old footer is removed.
  - **Fuel:** an "Include fuel" chip replaces the switch. The switch is kept, hidden, so every formula still reads `detTglFuel.Value`.
  - **Lane history:** the Expiry column becomes "Expires in", coloured, with the exact date on hover.
  - **Headings:** the "Read only" hint and the 1/2/3 numbers are gone; the ✎ badge on the edit panel stays.
  - **Button:** "Edit rate" is renamed "Edit status & dates", and the multi-active warning now says the same.
