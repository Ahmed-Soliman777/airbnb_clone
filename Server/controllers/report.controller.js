const Report = require("../models/Report.model");
const Listing = require("../models/Listing.model");

// Create a new report
const createReport = async (req, res) => {
  try {
    const { listingId, reason, details } = req.body;
    const reporterId = req.user._id;

    // Validate listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if user already reported this listing
    const existingReport = await Report.findOne({
      listingId,
      reporterId,
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: "You have already reported this listing",
      });
    }

    // Create report
    const report = new Report({
      listingId,
      reporterId,
      reason,
      details,
    });

    await report.save();

    // Populate reporter and listing info
    await report.populate("reporterId", "firstName lastName email avatar");
    await report.populate("listingId", "title images");

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit report",
      error: error.message,
    });
  }
};

// Get all reports for a user
const getUserReports = async (req, res) => {
  try {
    const reporterId = req.user._id;

    const reports = await Report.find({ reporterId })
      .populate("listingId", "title images address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// Get all reports for a specific listing (admin only)
const getListingReports = async (req, res) => {
  try {
    const { listingId } = req.params;

    const reports = await Report.find({ listingId })
      .populate("reporterId", "firstName lastName email avatar")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reports,
      totalReports: reports.length,
    });
  } catch (error) {
    console.error("Error fetching listing reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listing reports",
      error: error.message,
    });
  }
};

// Get all reports (admin only)
const getAllReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .populate("reporterId", "firstName lastName email avatar")
      .populate("listingId", "title images address hostId")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalReports = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReports / limit),
        totalReports,
        hasMore: skip + reports.length < totalReports,
      },
    });
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// Update report status (admin only)
const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;
    const adminId = req.user._id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;
    if (adminNotes) {
      report.adminNotes = adminNotes;
    }
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();

    await report.save();

    await report.populate("reporterId", "firstName lastName email");
    await report.populate("listingId", "title images");
    await report.populate("reviewedBy", "firstName lastName");

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      report,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update report status",
      error: error.message,
    });
  }
};

// Delete a report (admin only)
const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findByIdAndDelete(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete report",
      error: error.message,
    });
  }
};

// Get report statistics (admin only)
const getReportStats = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const reviewedReports = await Report.countDocuments({ status: "reviewed" });
    const resolvedReports = await Report.countDocuments({ status: "resolved" });
    const dismissedReports = await Report.countDocuments({
      status: "dismissed",
    });

    // Top reported listings
    const topReportedListings = await Report.aggregate([
      {
        $group: {
          _id: "$listingId",
          reportCount: { $sum: 1 },
        },
      },
      { $sort: { reportCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "_id",
          as: "listing",
        },
      },
      { $unwind: "$listing" },
      {
        $project: {
          listingId: "$_id",
          reportCount: 1,
          title: "$listing.title",
          images: "$listing.images",
        },
      },
    ]);

    // Reports by reason
    const reportsByReason = await Report.aggregate([
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalReports,
        pending: pendingReports,
        reviewed: reviewedReports,
        resolved: resolvedReports,
        dismissed: dismissedReports,
      },
      topReportedListings,
      reportsByReason,
    });
  } catch (error) {
    console.error("Error fetching report stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createReport,
  getUserReports,
  getListingReports,
  getAllReports,
  updateReportStatus,
  deleteReport,
  getReportStats,
};
