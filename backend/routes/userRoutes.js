router.get("/technicians", protect, adminOnly, async (req, res) => {
  const techs = await User.find({ role: "technician" });
  res.json(techs);
});

export default router;
