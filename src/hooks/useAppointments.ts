import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as appointmentsAPI from '../api/endpoints/appointments';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentsAPI.getAppointments(),
    staleTime: 30000, // 30 seconds
  });
};

export const useAppointmentDetail = (appointmentId: string) => {
  return useQuery({
    queryKey: ['appointments', appointmentId],
    queryFn: () => appointmentsAPI.getAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: appointmentsAPI.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason: string }) =>
      appointmentsAPI.cancelAppointment(appointmentId, { reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments', variables.appointmentId] });
    },
  });
};