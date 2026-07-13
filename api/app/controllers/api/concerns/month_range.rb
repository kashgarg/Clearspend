module Api
  module Concerns
    module MonthRange
      extend ActiveSupport::Concern

      private

      def resolve_month_range
        if params[:month].present?
          year, month = params[:month].to_s.split("-").map(&:to_i)
          Date.new(year, month, 1).all_month
        else
          Date.current.all_month
        end
      rescue ArgumentError, TypeError
        Date.current.all_month
      end

      def month_param(month_range = resolve_month_range)
        month_range.begin.strftime("%Y-%m")
      end
    end
  end
end
