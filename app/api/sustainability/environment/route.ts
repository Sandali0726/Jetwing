// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const { searchParams } = new URL(request.url);

    const propertyId = searchParams.get('propertyId');
    const startYear = searchParams.get('startYear');
    const startMonth = searchParams.get('startMonth');
    const endYear = searchParams.get('endYear');
    const endMonth = searchParams.get('endMonth');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    const hasDateRange =
      startYear !== null &&
      startMonth !== null &&
      endYear !== null &&
      endMonth !== null;

    const parsedStartYear = hasDateRange ? Number(startYear) : null;
    const parsedStartMonth = hasDateRange ? Number(startMonth) : null;
    const parsedEndYear = hasDateRange ? Number(endYear) : null;
    const parsedEndMonth = hasDateRange ? Number(endMonth) : null;

    let query = supabaseAdmin
      .from('sustainability_environment_dashboard_monthly')
      .select('*')
      .order('report_year', { ascending: true })
      .order('report_month', { ascending: true })
      .order('property_name', { ascending: true });

    if (propertyId && propertyId !== 'all') {
      query = query.eq('property_id', propertyId);
    }

    if (hasDateRange) {
      if (
        [parsedStartYear, parsedStartMonth, parsedEndYear, parsedEndMonth].some(
          (value) => value === null || Number.isNaN(value),
        )
      ) {
        return NextResponse.json(
          { error: 'Invalid start or end date filters.' },
          { status: 400 },
        );
      }
    }

    if (year) {
      const parsedYear = Number(year);
      if (!Number.isNaN(parsedYear)) {
        query = query.eq('report_year', parsedYear);
      }
    }

    if (month) {
      const parsedMonth = Number(month);
      if (!Number.isNaN(parsedMonth)) {
        query = query.eq('report_month', parsedMonth);
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const filtered = hasDateRange
      ? (data ?? []).filter((row) => {
          const rowIndex = Number(row.report_year) * 12 + Number(row.report_month);
          const startIndex = Number(parsedStartYear) * 12 + (Number(parsedStartMonth) - 1);
          const endIndex = Number(parsedEndYear) * 12 + (Number(parsedEndMonth) - 1);

          const priorMonthsParam = searchParams.get('priorMonths');
          const parsedPriorMonths = priorMonthsParam ? Number(priorMonthsParam) : 0;
          const startIndexAdjusted = startIndex - (Number.isFinite(parsedPriorMonths) ? parsedPriorMonths : 0);

          return rowIndex >= startIndexAdjusted && rowIndex <= endIndex;
        })
      : data ?? [];

    return NextResponse.json({ data: filtered });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}