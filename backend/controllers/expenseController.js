const Expense = require('../models/Expense');

exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    const populated = await expense.populate('category', 'name color icon');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};


exports.getAllExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter)
      .populate('category', 'name color icon')
      .sort({ date: -1 });

    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    next(err);
  }
};


exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('category', 'name color icon');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};


exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name color icon');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};


exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    next(err);
  }
};


exports.getSummary = async (req, res, next) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $sort: { total: -1 } },
    ]);

    const grandTotal = summary.reduce((acc, item) => acc + item.total, 0);
    res.json({ success: true, grandTotal, data: summary });
  } catch (err) {
    next(err);
  }
};
